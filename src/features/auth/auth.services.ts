import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserRecord } from "firebase-admin/auth";
import { BaseService } from "src/core/base/base_service";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { RestaurantDto } from "src/core/dt_objects/user/restaurant.dto";
import { LogInDto } from '../../core/dt_objects/auth/log_in.dto';
import { ForgotPasswordDto } from "src/core/dt_objects/auth/forgot_password.dto";
import { MailServices } from "src/core/services/mail_services";
import { ResetPasswordDto } from "src/core/dt_objects/auth/reset_password.dto";
import { MailVerificationRequestDto } from "src/core/dt_objects/auth/mail_verification_request.dto";
import { randomInt } from "crypto";
import { MailVerificationDto } from "src/core/dt_objects/auth/mail_verification.dto";
import { CustomerDto } from "src/core/dt_objects/auth/customer.dto";


@Injectable()
export class AuthService extends BaseService{

    private mailService:MailServices = new MailServices();

    async signUpAsRestaurant(data:RestaurantDto):Promise<RestaurantDto|HttpException>{
       if(await this._checkIsRestaurantAlreadyNotExist(data)){
        const newUser:UserRecord = await this.generateNewRestaurantInAuth(data);
       data.uid = newUser.uid;
       data.nextPaymentDate = this.generateNewRestaurantNextPaymentDate(),
       await this.firebase.setData(FirebaseColumns.RESTAURANTS,data.uid,data);
       return data;
       }
       else{
        return new HttpException("Bu bilgilerle bir işletme hesabı açılmış.",HttpStatus.CONFLICT);
       }
      
    }

    private async _checkIsRestaurantAlreadyNotExist(data:RestaurantDto):Promise<boolean>{
      const usersColumn:string = FirebaseColumns.RESTAURANTS;
      const getBankAccOwnerName = await this.firebase.getDataWithWhereQuery(usersColumn,"bankAccountOwner","==",data.bankAccountOwner);
      const getEmail = await this.firebase.getDataWithWhereQuery(usersColumn,"email","==",data.email);
      const getPhoneNumber = await this.firebase.getDataWithWhereQuery(usersColumn,"phoneNumber","==",data.phoneNumber);
      const getIban =  await this.firebase.getDataWithWhereQuery(usersColumn,"ibanNumber","==",data.ibanNumber);
      if(getBankAccOwnerName!=null||getEmail!=null||getPhoneNumber!=null||getIban!=null){
        return false;
      }
      else{
        return true;
      }
    }

    private generateNewRestaurantNextPaymentDate():string{
      const currentDate = new Date();
      const targetMonth = (currentDate.getMonth() + 6) % 12;
      const targetYear = currentDate.getFullYear() + Math.floor((currentDate.getMonth() + 6) / 12);
  
      const targetDate = new Date(targetYear, targetMonth, currentDate.getDate());
      return targetDate.toISOString();
    }

    private async generateNewRestaurantInAuth(data:RestaurantDto):Promise<UserRecord>{
       return  await this.firebase.auth.createUser(
            {
                email:data.email,
                emailVerified:data.isMailVerified,
                phoneNumber:data.phoneNumber,
                displayName:data.ownerName
            }
        );
    }

    async forgotPassword(data:ForgotPasswordDto,column:string):Promise<ForgotPasswordDto>{
      const user:Record<string,any>|null = await this.tryToGetUserWithEmail(data.mail,column);
      if(user == null){
        data.isMailSent=false;
        return data;  
      }
      else{
        const isMailSent:boolean =  await this.mailService.sendResetPasswordMail(data.mail,user.uid);
        data.isMailSent=isMailSent;
        data.uid=user.uid;
        await this.firebase.setData(FirebaseColumns.PASSWORD_RESET_REQUESTS,data.uid,{"uid":data.uid,"user":column});
        return data;
      }

      
    }

    async resetPassword(data:ResetPasswordDto,):Promise<ResetPasswordDto>{
        //user.uid=data.uid=requestCheck["uid"]
        const requestCheck:Record<string,string>= await this.firebase.getDoc(FirebaseColumns.PASSWORD_RESET_REQUESTS,data.uid);
        let user:any;
        if(requestCheck["user"]==FirebaseColumns.CUSTOMERS){
           user = CustomerDto.fromJson(await this.firebase.getDoc(FirebaseColumns.CUSTOMERS,requestCheck["uid"]));
           user.password = data.newPassword;
           await this.firebase.updateData(FirebaseColumns.CUSTOMERS,data.uid, CustomerDto.toJson(user));
        }
        else{
          user= RestaurantDto.fromJson(await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,requestCheck["uid"]));
          user.password = data.newPassword;
          await this.firebase.updateData(FirebaseColumns.RESTAURANTS,data.uid, RestaurantDto.toJson(user));
        }
        
        
        await this.firebase.deleteDoc(FirebaseColumns.PASSWORD_RESET_REQUESTS,user.uid);
        return data;
    }


    async logInAsRestaurant(data:LogInDto){

        //Try to get user from auth services.
        const user:Record<string,any>|null = await this.tryToGetUserWithEmail(data.mail,FirebaseColumns.RESTAURANTS);

        //If user does not exist in our db return false values. 
        if(user == null){
          data.isLoginSuccess=false;
          data.unSuccessfulReason="Hatalı E-Posta";
        }
        
        //If user already exist in our db check the password from firestore(auth services does not share password with us).
        else{
        const userFromDb:RestaurantDto = RestaurantDto.fromJson(await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,user.uid));
        if(data.password==userFromDb.password){
            data.isLoginSuccess = true;
            data.uid = userFromDb.uid;
            data.restaurantData = userFromDb;
            }
            else{
                data.isLoginSuccess=false;
                data.unSuccessfulReason="Hatalı Şifre";
            }
        }
        return data;
    }

    private async tryToGetUserWithEmail(email:string,column:string):Promise<Record<string,any>|null>{
       try {
        const user:any|null =(await this.firebase.getDataWithWhereQuery(column,"email","==",email))[0];
        return user;
       } catch (error) {
        return null;
       }
        
    }



    async mailVerificationRequest(params:MailVerificationRequestDto):Promise<MailVerificationRequestDto>{
      const activationCode:string = randomInt(1000,9999).toString();
      const isMailSent:boolean=await this.mailService.sendVerificationCode(params.email,activationCode);
      params.isMailSent=isMailSent;
      if(isMailSent){
        params.verificationCode=activationCode;
        await this.firebase.setData(FirebaseColumns.VERIFICATION_REQUESTS,params.email,MailVerificationRequestDto.toJson(params));
      }
      return params;
    }


    async mailVerification(params:MailVerificationDto):Promise<MailVerificationDto>{
      const columnName:string = FirebaseColumns.VERIFICATION_REQUESTS;
      const response:MailVerificationDto = MailVerificationDto.fromJson(await this.firebase.getDoc(columnName,params.email));
      if(response.verificationCode==params.verificationCode){
        params.isCodeTrue=true;
        await this.firebase.deleteDoc(columnName,params.email);
      }
      else{
        params.isCodeTrue=false;
      }
      return params;
    }



    async signUpCustomer(params:CustomerDto):Promise<CustomerDto|HttpException>{
      try {
       if(!await this.isCustomerAlreadyExist(params.email)){
        return new HttpException(
          "Bu email adresi daha önceden kullanılmış.",
          HttpStatus.ACCEPTED,
        );
       }
       else{
        await this.firebase.setData(FirebaseColumns.CUSTOMERS,params.uid,CustomerDto.toJson(params),);
       return params;
       }
      } catch (error) {
        return new HttpException(
          "Kayıt olma başarısız",
          HttpStatus.ACCEPTED,
        );
      }
    }


    private async isCustomerAlreadyExist(email:string):Promise<boolean>{
      const getEmail = await this.firebase.getDataWithWhereQuery(FirebaseColumns.CUSTOMERS,"email","==",email);
      if(getEmail!=null){
        return false;
      }
      else{
        return true;
      }
    }


    async logInAsCustomer(data:LogInDto){

      //Try to get user from auth services.
      const user:Record<string,any>|null = await this.tryToGetUserWithEmail(data.mail,FirebaseColumns.CUSTOMERS);

      //If user does not exist in our db return false values. 
      if(user == null){
        data.isLoginSuccess=false;
        data.unSuccessfulReason="Hatalı E-Posta";
      }
      
      //If user already exist in our db check the password from firestore(auth services does not share password with us).
      else{
      const userFromDb:CustomerDto = CustomerDto.fromJson(await this.firebase.getDoc(FirebaseColumns.CUSTOMERS,user.uid));
      if(data.password==userFromDb.password){
          data.isLoginSuccess = true;
          data.uid = userFromDb.uid;
          data.customerData = userFromDb;
          }
          else{
              data.isLoginSuccess=false;
              data.unSuccessfulReason="Hatalı Şifre";
          }
      }
      return data;
  }

}