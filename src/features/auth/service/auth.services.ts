import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base_service";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { RestaurantDto } from "src/core/dt_objects/user/restaurant.dto";
import { ForgotPasswordDto } from "src/core/dt_objects/auth/forgot_password.dto";
import { MailServices } from "src/core/services/mail_services";
import { ResetPasswordDto } from "src/core/dt_objects/auth/reset_password.dto";
import { MailVerificationRequestDto } from "src/core/dt_objects/auth/mail_verification_request.dto";
import { randomInt } from "crypto";
import { MailVerificationDto } from "src/core/dt_objects/auth/mail_verification.dto";
import { CustomerDto } from "src/core/dt_objects/user/customer.dto";
import { LogInDto } from "src/core/dt_objects/auth/log_in.dto";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService extends BaseService {

    constructor(private readonly jwtService:JwtService) {
      super();
    }
    private mailService:MailServices = new MailServices();

    

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
        //Attacker can take new password data with arp poisoning attack so we must hide the password
        data.newPassword="";
        return data;
    }


    

     async tryToGetUserWithEmail(email:string,column:string):Promise<Record<string,any>|null>{
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


    async logIn(data:LogInDto,column:string){

      //First check is user who want to log in is restaurant user.
      const isUserRestaurant:boolean = column==FirebaseColumns.CUSTOMERS?false:true;

      //Try to get user
      const user:Record<string,any>|null = await this.tryToGetUserWithEmail(data.mail,column);

      //If user does not exist in our db return false values. 
      if(user == null){
        data.isLoginSuccess=false;
        data.unSuccessfulReason="Hatalı E-Posta";
      }
      
      //If user already exist in our db check the password is true.
      else{
      const userFromDb:any = isUserRestaurant ? RestaurantDto.fromJson(user):CustomerDto.fromJson(user);
      if(data.password==userFromDb.password){
          data.isLoginSuccess = true;
          data.uid = userFromDb.uid;
          isUserRestaurant? data.restaurantData = userFromDb: data.customerData=userFromDb;
          data.accessToken = await this.jwtService.signAsync({email:data.mail,pass:data.password});
          }
          else{
              data.isLoginSuccess=false;
              data.unSuccessfulReason="Hatalı Şifre";
          }
      }
      return data;
  }
}