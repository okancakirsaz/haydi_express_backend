import { Injectable } from "@nestjs/common";
import { UserRecord } from "firebase-admin/auth";
import { BaseService } from "src/core/base/base_service";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { RestaurantDto } from "src/core/dt_objects/user/restaurant.dto";
import { LogInDto } from '../../core/dt_objects/auth/log_in.dto';


//TODO:Make email verification system after then frontend
@Injectable()
export class AuthService extends BaseService{
    async signUpAsRestaurant(data:RestaurantDto):Promise<RestaurantDto>{
       const newUser:UserRecord = await this.generateNewRestaurantInAuth(data);
       data.uid = newUser.uid;
       //TODO:Review it
       data.accountCreationDate=new Date().getUTCDate().toString();
       await this.firebase.setData(FirebaseColumns.RESTAURANTS,data.uid,data);
       return data;
    }

    private async generateNewRestaurantInAuth(data:RestaurantDto):Promise<UserRecord>{
       return  await this.firebase.auth.createUser(
            {
                email:data.email,
                emailVerified:data.isMailVerified,
                phoneNumber:data.phoneNumber,
                password:data.password,
                displayName:data.ownerName
            }
        );
    }

    //TODO: Do after web-interface
    async forgotPasswordInRestaurant(){} 
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
        const userFromDb:RestaurantDto = RestaurantDto.fromJson(await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,user.uid));
        if(data.password==userFromDb.password){
            data.isLoginSuccess = true;
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
}