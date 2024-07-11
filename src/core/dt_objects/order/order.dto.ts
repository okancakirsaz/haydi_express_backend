import { MenuDto } from "../menu/menu.dto";
import { AddressDto } from "../user/address/address.dto";
import { PaymentDto } from "./payment.dto";

export class OrderDto{
    orderId:string;
    paymentData:PaymentDto;
    addressData:AddressDto;
    menuData:MenuDto[];
    paymentMethod:string;
    orderState:string;
    orderCreationDate:string;
    customerName:string;
    customerId:string;
    customerPhoneNumber:string;
    note:string;
    isPaidSuccess?:boolean;
    courierId?:string;
    

    static toJson(data: OrderDto): any {
        return {
          "orderId": data.orderId,
          "paymentData":PaymentDto.toJson(data.paymentData),
          "addressData": AddressDto.toJson(data.addressData),
          "menuData":data.menuData.map((e)=>MenuDto.toJson(e)),
          "paymentMethod":data.paymentMethod,
          "orderState": data.orderState,
          "orderCreationDate":data.orderCreationDate,
          "customerName": data.customerName,
          "customerId": data.customerId,
          "customerPhoneNumber":data.customerPhoneNumber,
          "note":data.note,
          "isPaidSuccess":data.isPaidSuccess,
          "courierId":data.courierId,
        };
      }
    
      static fromJson(data: any): OrderDto {
        const object: OrderDto = new OrderDto();
        object.orderId = data['orderId'];
        object.paymentData = PaymentDto.fromJson(data["paymentData"]);
        object.addressData = AddressDto.fromJson(data['addressData']);
        object.menuData=data["menuData"].map((e)=>MenuDto.fromJson(e));
        object.paymentMethod=data["paymentMethod"];
        object.orderState = data['orderState'];
        object.orderCreationDate = data["orderCreationDate"];
        object.customerName = data['customerName'];
        object.customerId = data['customerId'];
        object.customerPhoneNumber=data["customerPhoneNumber"];
        object.note = data["note"];
        object.isPaidSuccess=data['isPaidSuccess'];
        object.courierId=data['courierId'];
        return object;
      }
}