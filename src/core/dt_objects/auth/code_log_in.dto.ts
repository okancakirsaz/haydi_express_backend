export class CodeLogInDto {
    code: string;
    accessToken?:string
    
    static toJson(data: CodeLogInDto): any {
      return {
        "code": data.code,
        "accessToken":data.accessToken
      };
    }
  
    static fromJson(data: any): CodeLogInDto {
      const object: CodeLogInDto = new CodeLogInDto();
      object.code = data['code'];
      object.accessToken=data["accessToken"];
      return object;
    }
  }
  