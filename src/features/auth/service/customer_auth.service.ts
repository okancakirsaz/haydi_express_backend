import { BaseService } from "src/core/base/base_service";
import { AuthService } from "./auth.services";
import { CustomerDto } from "src/core/dt_objects/user/customer.dto";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { LogInDto } from "src/core/dt_objects/auth/log_in.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomerAuthService extends AuthService{
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
  
      //TODO: Optimize it
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