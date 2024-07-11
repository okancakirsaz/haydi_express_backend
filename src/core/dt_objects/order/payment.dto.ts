import { CardDto } from "./card.dto";
import { RevenueDto } from "./revenue.dto";

export class PaymentDto{
    cardData?:CardDto;
    revenues:RevenueDto[];
    totalPrice:number;


    static toJson(data: PaymentDto): any {
        return {
          "cardData":data.cardData!=null? CardDto.toJson(data.cardData):null,
          "revenues": data.revenues.map((e)=>RevenueDto.toJson(e)),
          "totalPrice":data.totalPrice,
        };
      }
    
      static fromJson(data: any): PaymentDto {
        const object: PaymentDto = new PaymentDto();
        object.cardData = data["cardData"]!=null? CardDto.fromJson(data["cardData"]):null;
        object.revenues = data['revenues'].map((e)=>RevenueDto.fromJson(e));
        object.totalPrice=data["totalPrice"];
        return object;
      }
}


































