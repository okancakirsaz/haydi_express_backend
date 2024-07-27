import { CardDto } from "../order/card.dto"
import { WorkHoursDto } from "../public/work_hours.dto"
import { AddressDto } from "./address/address.dto"

export class RestaurantDto {
  ownerName:string
  ownerSurname:string
  phoneNumber:string
  businessName:string
  email:string
  password:string
  taxNumber:string
  isMailVerified:boolean
  address:AddressDto
  wantDeliveryFromUs:boolean
  ibanNumber:string
  bankName:string
  bankAccountOwner:string
  workHours:WorkHoursDto;
  payment:CardDto;
  isPoliciesAccepted:boolean
  accountCreationDate:string
  uid:string
  nextPaymentDate?:string;
  isAccountBanned:boolean;

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
        "address":AddressDto.toJson(data.address),
        "wantDeliveryFromUs":data.wantDeliveryFromUs,
        "ibanNumber":data.ibanNumber,
        "bankName":data.bankName,
        "bankAccountOwner":data.bankAccountOwner,
        "workHours":WorkHoursDto.toJson(data.workHours),
        "payment":CardDto.toJson(data.payment),
        "isPoliciesAccepted":data.isPoliciesAccepted,
        "accountCreationDate":data.accountCreationDate,
        "uid":data.uid,
        "nextPaymentDate":data.nextPaymentDate,
        "isAccountBanned":data.isAccountBanned,
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
    object.address=AddressDto.fromJson(data["address"]);
    object.wantDeliveryFromUs=data["wantDeliveryFromUs"];
    object.ibanNumber=data["ibanNumber"];
    object.bankName=data["bankName"];
    object.bankAccountOwner=data["bankAccountOwner"];
    object.workHours=WorkHoursDto.fromJson(data["workHours"]);
    object.payment=CardDto.fromJson(data["payment"]);
    object.isPoliciesAccepted=data["isPoliciesAccepted"];
    object.accountCreationDate=data["accountCreationDate"];
    object.uid=data["uid"];
    object.nextPaymentDate=data['nextPaymentDate'];
    object.isAccountBanned=data['isAccountBanned']

    return object;
  }
}
