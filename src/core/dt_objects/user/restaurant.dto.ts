export class RestaurantDto {
  ownerName:string
  ownerSurname:string
  phoneNumber:string
  businessName:string
  email:string
  password:string
  taxNumber:string
  isMailVerified:boolean
  address:string
  wantDeliveryFromUs:boolean
  ibanNumber:string
  bankName:string
  bankAccountOwner:string
  cardNumber:string
  cardOwner:string
  cardCvv:string
  cardExpirationDate:string
  isPoliciesAccepted:boolean
  accountCreationDate:string
  uid:string

  static toJson(data: RestaurantDto): any {
    return {
        "ownerName":data.ownerName,
        "ownerSurname":data.ownerSurname,
        "phoneNumber":data.phoneNumber,
        "businessName":data.businessName,
        "email":data.email,
        "password":data.password,
        "taxNumber":data.taxNumber,
        "isMailVerified":data.isMailVerified,
        "address":data.address,
        "wantDeliveryFromUs":data.wantDeliveryFromUs,
        "ibanNumber":data.ibanNumber,
        "bankName":data.bankName,
        "bankAccountOwner":data.bankAccountOwner,
        "cardNumber":data.cardNumber,
        "cardOwner":data.cardOwner,
        "cardCvv":data.cardCvv,
        "cardExpirationDate":data.cardExpirationDate,
        "isPoliciesAccepted":data.isPoliciesAccepted,
        "accountCreationDate":data.accountCreationDate,
        "uid":data.uid
    };
  }

  static fromJson(data: any): RestaurantDto {
    const object: RestaurantDto = new RestaurantDto();

    object.ownerName=data["ownerName"];
    object.ownerSurname=data["ownerSurname"];
    object.phoneNumber=data["phoneNumber"];
    object.businessName=data["businessName"];
    object.email=data["email"];
    object.password=data["password"];
    object.taxNumber=data["taxNumber"];
    object.isMailVerified=data["isMailVerified"];
    object.address=data["address"];
    object.wantDeliveryFromUs=data["wantDeliveryFromUs"];
    object.ibanNumber=data["ibanNumber"];
    object.bankName=data["bankName"];
    object.bankAccountOwner=data["bankAccountOwner"];
    object.cardNumber=data["cardNumber"];
    object.cardOwner=data["cardOwner"];
    object.cardCvv=data["cardCvv"];
    object.cardExpirationDate=data["cardExpirationDate"];
    object.isPoliciesAccepted=data["isPoliciesAccepted"];
    object.accountCreationDate=data["accountCreationDate"];
    object.uid=data["uid"];

    return object;
  }
}
