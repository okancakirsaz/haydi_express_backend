export class CustomerDto{
    email:string
    password:string
    isAgreementsAccepted:boolean
    name:string
    phoneNumber:string
    gender:string
    isPhoneVerified:boolean
    uid:string


    static toJson(data: CustomerDto): any {
        return {
          "email": data.email,
          "password": data.password,
          "isAgreementsAccepted": data.isAgreementsAccepted,
          "name": data.name,
          "phoneNumber": data.phoneNumber,
          "gender": data.gender,
          "isPhoneVerified": data.isPhoneVerified,
          "uid":data.uid,
          
        };
      }
    
      static fromJson(data: any): CustomerDto {
        const object: CustomerDto = new CustomerDto();
        object.email = data['email'];
        object.password = data['password'];
        object.isAgreementsAccepted = data['isAgreementsAccepted'];
        object.name = data['name'];
        object.phoneNumber = data['phoneNumber'];
        object.gender = data['gender'];
        object.uid = data["uid"];
        object.isPhoneVerified = data['isPhoneVerified'];
    
        return object;
      }
}