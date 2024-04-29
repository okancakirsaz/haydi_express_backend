export class MailVerificationDto{
    email:string;
    isCodeTrue:boolean;
    verificationCode:string;

    static toJson(data: MailVerificationDto): any {
        return {
          "email":data.email,
          "isCodeTrue":data.isCodeTrue,
          "verificationCode":data.verificationCode,
        };
      }
    
      static fromJson(data: any): MailVerificationDto {
        const object: MailVerificationDto = new MailVerificationDto();
        object.email=data["email"];
        object.isCodeTrue=data["isCodeTrue"];
        object.verificationCode=data["verificationCode"];
        return object;
      }
}