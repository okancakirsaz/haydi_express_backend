export class LogInDto {
    mail: string;
    password: string;
    isLoginSuccess:boolean
    unSuccessfulReason?:string
    
    static toJson(data: LogInDto): any {
      return {
        "mail": data.mail,
        "password":data.password,
        "isLoginSuccess": data.isLoginSuccess,
        "unSuccessfulReason":data.unSuccessfulReason
      };
    }
  
    static fromJson(data: any): LogInDto {
      const object: LogInDto = new LogInDto();
      object.mail = data['mail'];
      object.password = data["password"];
      object.isLoginSuccess = data['isLoginSuccess'];
      object.unSuccessfulReason=data["unSuccessfulReason"];
      return object;
    }
  }
  