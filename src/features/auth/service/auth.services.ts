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


@Injectable()
export class AuthService extends BaseService {

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


    //TODO: *REVIEW* When returning hide password data at response because
    //if user web client receive new password this may be reason for few security vulnerable.
    //Attacker can take new password data with arp poisoning attack
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



    
}