export class BoostRestaurantOrMenuDto{
    expireDate:string;
    elementId:string;
    isRestaurant:boolean;
    restaurantId:string;
    boostArea:string;

    static toJson(data: BoostRestaurantOrMenuDto): any {
        return {
          "expireDate": data.expireDate,
          "elementId":data.elementId,
          "isRestaurant":data.isRestaurant,
          "restaurantId":data.restaurantId,
          "boostArea":data.boostArea,
        };
      }
    
      static fromJson(data: any): BoostRestaurantOrMenuDto {
        const object: BoostRestaurantOrMenuDto = new BoostRestaurantOrMenuDto();
        object.expireDate = data['expireDate'];
        object.elementId=data["elementId"];
        object.isRestaurant = data["isRestaurant"];
        object.restaurantId = data["restaurantId"];
        object.boostArea = data["boostArea"];
        return object;
      }
}