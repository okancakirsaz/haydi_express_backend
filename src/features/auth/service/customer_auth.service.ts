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
          //Attacker can take new password data with arp poisoning attack so we must hide the password
          params.password="";
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
  
}