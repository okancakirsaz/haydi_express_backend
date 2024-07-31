import { CodeLogInDto } from "src/core/dt_objects/auth/code_log_in.dto";
import { AuthService } from "./auth.services";
import { HttpException, HttpStatus } from "@nestjs/common";

export class HubAuthService extends AuthService{
  //Using in cronjob_services
  async createDailyCredentials(){
    const code:string = this.getRandomCode();
    const credentials:Record<string,string> = {"accessCode":code};
    await this.logDatabase.db.collection("HUB").doc("credentials").set(credentials);
    await this.mailService.sendHubAccessCode(code);
  }


  private getRandomCode():string{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@?';
    let randomCode = '';
    for (let i = 0; i < characters.length; i++) {
        if(randomCode.length>=6){
            break;
        }
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomCode += characters[randomIndex];
    }
    return randomCode;
  }



  async logInWithCode(params:CodeLogInDto):Promise<CodeLogInDto|HttpException>{
        const code:string = ((await this.logDatabase.db.collection("HUB").doc("credentials").get()).data())["accessCode"];
        if(code==params.code){
            params.accessToken = await this.jwtService.signAsync({email:"ocakirsaz@gmail.com",pass:params.code});
            return params;
        }
        else{
            return new HttpException("Girilen kod geçerli değil.",HttpStatus.BAD_REQUEST);
        }
  }
}