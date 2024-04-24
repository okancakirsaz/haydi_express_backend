export class ForgotPasswordDto {
  mail: string;
  isMailSent: boolean;
  
  static toJson(data: ForgotPasswordDto): any {
    return {
      "mail": data.mail,
      "isMailSent": data.isMailSent,
    };
  }

  static fromJson(data: any): ForgotPasswordDto {
    const object: ForgotPasswordDto = new ForgotPasswordDto();
    object.mail = data['mail'];
    object.isMailSent = data['isMailSent'];

    return object;
  }
}
