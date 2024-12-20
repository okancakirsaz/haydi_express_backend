import { MenuDto } from "../menu/menu.dto";
import { AddressDto } from "../user/address/address.dto";
import { BucketElementDto } from "./bucket_element.dto";
import { PaymentDto } from "./payment.dto";

export class OrderDto{
    orderId:string;
    paymentData:PaymentDto;
    addressData:AddressDto;
    menuData:BucketElementDto[];
    paymentMethod:string;
    orderState:string;
    orderCreationDate:string;
    customerName:string;
    customerId:string;
    restaurantId:string;
    isCancelledFromCourier?:boolean;
    restaurantName:string;
    deliveryDate?:string;
    distance?:number;
    isDeliveringWithCourierService:boolean
    customerPhoneNumber:string;
    note:string;
    isPaidSuccess?:boolean;
    courierId?:string;
    

    static toJson(data: OrderDto): any {
        return {
          "orderId": data.orderId,
          "paymentData":PaymentDto.toJson(data.paymentData),
          "addressData": AddressDto.toJson(data.addressData),
          "menuData":data.menuData.map((e)=>BucketElementDto.toJson(e)),
          "paymentMethod":data.paymentMethod,
          "orderState": data.orderState,
          "orderCreationDate":data.orderCreationDate,
          "isDeliveringWithCourierService":data.isDeliveringWithCourierService,
          "customerName": data.customerName,
          "deliveryDate":data.deliveryDate,
          "distance":data.distance,
          "isCancelledFromCourier":data.isCancelledFromCourier,
          "customerId": data.customerId,
          "restaurantId": data.restaurantId,
          "restaurantName": data.restaurantName,
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
        object.menuData=data["menuData"].map((e)=>BucketElementDto.fromJson(e));
        object.paymentMethod=data["paymentMethod"];
        object.orderState = data['orderState'];
        object.orderCreationDate = data["orderCreationDate"];
        object.isDeliveringWithCourierService = data["isDeliveringWithCourierService"];
        object.customerName = data['customerName'];
        object.customerId = data['customerId'];
        object.restaurantId = data['restaurantId'];
        object.restaurantName = data['restaurantName'];
        object.customerPhoneNumber=data["customerPhoneNumber"];
        object.note = data["note"];
        object.distance = data["distance"];
        object.deliveryDate=data['deliveryDate'];
        object.isPaidSuccess=data['isPaidSuccess'];
        object.courierId=data['courierId'];
        object.isCancelledFromCourier = data['isCancelledFromCourier'];
        return object;
      }
}