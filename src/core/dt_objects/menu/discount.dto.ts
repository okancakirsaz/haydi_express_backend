export class DiscountDto{
    amount:number;
    expireDate:string;
    menuId:string;

    static toJson(data: DiscountDto): any {
        return {
          "amount":data.amount,
          "expireDate": data.expireDate,
          "menuId":data.menuId,
        };
      }
    
      static fromJson(data: any): DiscountDto {
        const object: DiscountDto = new DiscountDto();
        object.amount = data["amount"];
        object.expireDate = data['expireDate'];
        object.menuId=data["menuId"];
        return object;
      }
}