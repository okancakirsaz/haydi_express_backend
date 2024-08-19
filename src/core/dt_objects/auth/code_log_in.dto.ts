export class CodeLogInDto {
    code: string;
    userId?:string;
    accessToken?:string
    
    static toJson(data: CodeLogInDto): any {
      return {
        "code": data.code,
        "userId":data.userId,
        "accessToken":data.accessToken,
      };
    }
  
    static fromJson(data: any): CodeLogInDto {
      const object: CodeLogInDto = new CodeLogInDto();
      object.code = data['code'];
      object.userId = data['userId'];
      object.accessToken=data["accessToken"];
      return object;
    }
  }
  