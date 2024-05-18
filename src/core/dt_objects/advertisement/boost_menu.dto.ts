export class BoostMenuDto{
    expireDate:string;
    menuId:string;
    boostArea:string;

    static toJson(data: BoostMenuDto): any {
        return {
          "expireDate": data.expireDate,
          "menuId":data.menuId,
          "boostArea":data.boostArea,
        };
      }
    
      static fromJson(data: any): BoostMenuDto {
        const object: BoostMenuDto = new BoostMenuDto();
        object.expireDate = data['expireDate'];
        object.menuId=data["menuId"];
        object.boostArea = data["boostArea"];
        return object;
      }
}