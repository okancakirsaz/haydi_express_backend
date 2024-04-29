export class MailVerificationRequestDto{
    email:string;
    isMailSent:boolean;
    verificationCode?:string;

    static toJson(data: MailVerificationRequestDto): any {
        return {
          "email":data.email,
          "isMailSent":data.isMailSent,
          "verificationCode":data.verificationCode,
        };
      }
    
      static fromJson(data: any): MailVerificationRequestDto {
        const object: MailVerificationRequestDto = new MailVerificationRequestDto();
        object.email=data["email"];
        object.isMailSent=data["isMailSent"];
        object.verificationCode=data["verificationCode"];
        return object;
      }
}