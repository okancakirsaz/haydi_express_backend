export class ForgotPasswordDto {
  mail: string;
  uid:string;
  isMailSent: boolean;
  
  static toJson(data: ForgotPasswordDto): any {
    return {
      "mail": data.mail,
      "uid":data.uid,
      "isMailSent": data.isMailSent,
    };
  }

  static fromJson(data: any): ForgotPasswordDto {
    const object: ForgotPasswordDto = new ForgotPasswordDto();
    object.mail = data['mail'];
    object.uid = data["uid"];
    object.isMailSent = data['isMailSent'];

    return object;
  }
}
