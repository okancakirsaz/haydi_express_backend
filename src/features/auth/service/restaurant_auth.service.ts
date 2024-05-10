import { HttpException, HttpStatus } from "@nestjs/common";
import { UserRecord } from "firebase-admin/auth";
import { BaseService } from "src/core/base/base_service";
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

     //TODO: Optimize it
     async logInAsRestaurant(data:LogInDto){

        //Try to get user
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
}