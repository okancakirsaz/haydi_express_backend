export class CardDto{
    cardHolder:string;
    expireDate:string;
    cardNumber:string;
    cvv:string;

    static toJson(data: CardDto): any {
        return {
          "cardHolder":data.cardHolder,
          "expireDate": data.expireDate,
          "cardNumber":data.cardNumber,
          "cvv":data.cvv,
        };
      }
    
      static fromJson(data: any): CardDto {
        const object: CardDto = new CardDto();
        object.cardHolder = data["cardHolder"];
        object.expireDate = data['expireDate'];
        object.cardNumber=data["cardNumber"];
        object.cvv=data["cvv"];
        return object;
      }
}


































