import { CardDto } from "./card.dto";

export class PaymentDto{
    cardData?:CardDto;
    totalPrice:number;


    static toJson(data: PaymentDto): any {
        return {
          "cardData":data.cardData!=null? CardDto.toJson(data.cardData):null,
          "totalPrice":data.totalPrice,
        };
      }
    
      static fromJson(data: any): PaymentDto {
        const object: PaymentDto = new PaymentDto();
        object.cardData = data["cardData"]!=null? CardDto.fromJson(data["cardData"]):null;
        object.totalPrice=data["totalPrice"];
        return object;
      }
}


































