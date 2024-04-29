import { Injectable } from "@nestjs/common";
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


//TODO:Add email verification
@Injectable()
export class AuthService extends BaseService{

    private mailService:MailServices = new MailServices();

    async signUpAsRestaurant(data:RestaurantDto):Promise<RestaurantDto>{
       const newUser:UserRecord = await this.generateNewRestaurantInAuth(data);
       data.uid = newUser.uid;
       data.accountCreationDate=new Date().toUTCString();
       await this.firebase.setData(FirebaseColumns.USERS,data.uid,data);
       return data;
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

    async forgotPassword(data:ForgotPasswordDto):Promise<ForgotPasswordDto>{
      const user:UserRecord|null = await this.tryToGetUserWithEmail(data.mail);
      if(user == null){
        data.isMailSent=false;
        return data;
      }
      else{
        const isMailSent:boolean =  await this.mailService.sendResetPasswordMail(data.mail,user.uid);
        data.isMailSent=isMailSent;
        data.uid=user.uid;
        await this.firebase.setData(FirebaseColumns.PASSWORD_RESET_REQUESTS,data.uid,{"uid":data.uid});
        return data;
      }

      
    }

    async resetPassword(data:ResetPasswordDto):Promise<ResetPasswordDto>{
        //user.uid=data.uid=requestCheck["uid"]
        const requestCheck:Record<string,string>= await this.firebase.getDoc(FirebaseColumns.PASSWORD_RESET_REQUESTS,data.uid);
        const user:RestaurantDto = RestaurantDto.fromJson(await this.firebase.getDoc(FirebaseColumns.USERS,requestCheck["uid"]));
        user.password = data.newPassword;
        await this.firebase.updateData(FirebaseColumns.USERS,data.uid,RestaurantDto.toJson(user));
        await this.firebase.deleteDoc(FirebaseColumns.PASSWORD_RESET_REQUESTS,user.uid);
        return data;
    }


    async logInAsRestaurant(data:LogInDto){

        //Try to get user from auth services.
        const user:UserRecord|null = await this.tryToGetUserWithEmail(data.mail);

        //If user does not exist in our db return false values. 
        if(user == null){
          data.isLoginSuccess=false;
          data.unSuccessfulReason="Hatalı E-Posta";
        }
        
        //If user already exist in our db check the password from firestore(auth services does not share password with us).
        else{
        const userFromDb:RestaurantDto = RestaurantDto.fromJson(await this.firebase.getDoc(FirebaseColumns.USERS,user.uid));
        if(data.password==userFromDb.password){
            data.isLoginSuccess = true;
            data.uid = userFromDb.uid;
            }
            else{
                data.isLoginSuccess=false;
                data.unSuccessfulReason="Hatalı Şifre";
            }
        }
        return data;
    }

    private async tryToGetUserWithEmail(email:string):Promise<UserRecord|null>{
       try {
        const user:UserRecord = await this.firebase.auth.getUserByEmail(email);
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
}