import { HttpException, HttpStatus } from "@nestjs/common";
import { UserRecord } from "firebase-admin/auth";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { LogInDto } from "src/core/dt_objects/auth/log_in.dto";
import { RestaurantDto } from "src/core/dt_objects/user/restaurant.dto";
import { AuthService } from "./auth.services";

export class RestaurantAuthService extends AuthService{
    async signUpAsRestaurant(data:RestaurantDto):Promise<RestaurantDto|HttpException>{
        if(await this._checkIsRestaurantAlreadyNotExist(data)){
         const newUser:UserRecord = await this.generateNewRestaurantInAuth(data);
        data.uid = newUser.uid;
        data.nextPaymentDate = this.generateNewRestaurantNextPaymentDate(),
        await this.firebase.setData(FirebaseColumns.RESTAURANTS,data.uid,data);
        data.password="";
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
}