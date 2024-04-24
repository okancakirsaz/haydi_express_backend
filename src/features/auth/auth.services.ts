import { Injectable } from "@nestjs/common";
import { UserRecord } from "firebase-admin/auth";
import { BaseService } from "src/core/base/base_service";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { UserDto } from "src/core/dt_objects/user/user.dto";
import { LogInDto } from '../../core/dt_objects/auth/log_in.dto';


//TODO:Make email verification system after then frontend
@Injectable()
export class AuthService extends BaseService{
    async signUp(data:UserDto):Promise<UserDto>{
       const newUser:UserRecord = await this.generateNewUserInAuth(data);
       data.uid = newUser.uid;
       await this.firebase.setData(FirebaseColumns.USERS,data.uid,data);
       return data;
    }

    private async generateNewUserInAuth(data:UserDto):Promise<UserRecord>{
       return  await this.firebase.auth.createUser(
            {
                email:data.mail,
                emailVerified:data.emailVerified,
                phoneNumber:data.phoneNumber,
                password:data.password,
                displayName:data.userName
            }
        );
    }

    //TODO: Do after frontend
    async forgotPassword(){} 
    async logIn(data:LogInDto){

        //Try to get user from auth services.
        const user:UserRecord|null = await this.tryToGetUserWithEmail(data.mail);

        //If user does not exist in our db return false values. 
        if(user == null){
          data.isLoginSuccess=false;
          data.unSuccessfulReason="Email is incorrect.";
        }
        
        //If user already exist in our db check the password from firestore(auth services does not share password with us).
        else{
        const userFromDb:UserDto = UserDto.fromJson(await this.firebase.getDoc(FirebaseColumns.USERS,user.uid));
        if(data.password==userFromDb.password){
            data.isLoginSuccess = true;
            }
            else{
                data.isLoginSuccess=false;
                data.unSuccessfulReason="Password is incorrect.";
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