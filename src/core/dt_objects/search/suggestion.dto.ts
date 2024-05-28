    export class SuggestionDto{
     name:string;
     isRestaurant:boolean;
     isOnDiscount:boolean;
     isBoosted:boolean;
     price:number;
     discountAmount:number;
     elementId:string;

    static toJson(data: SuggestionDto): any {
        return {
          "name": data.name,
          "isOnDiscount":data.isOnDiscount,
          "isRestaurant":data.isRestaurant,
          "isBoosted":data.isBoosted,
          "price":data.price,
          "discountAmount":data.discountAmount,
          "elementId":data.elementId,
        };
      }
    
      static fromJson(data: any): SuggestionDto {
        const object: SuggestionDto = new SuggestionDto();
        object.name = data['name'];
        object.isOnDiscount=data["isOnDiscount"];
        object.isRestaurant = data["isRestaurant"];
        object.isBoosted = data["isBoosted"];
        object.price = data["price"];
        object.isBoosted = data["isBoosted"];
        object.elementId = data["elementId"];
        return object;
      }
}