export class ResetPasswordDto{
    newPassword:string;
    uid:string;

    static toJson(data: ResetPasswordDto): any {
        return {
          "newPassword":data.newPassword,
          "uid":data.uid,
        };
      }
    
      static fromJson(data: any): ResetPasswordDto {
        const object: ResetPasswordDto = new ResetPasswordDto();
        object.newPassword=data["newPassword"];
        object.uid=data["uid"];
        return object;
      }
}