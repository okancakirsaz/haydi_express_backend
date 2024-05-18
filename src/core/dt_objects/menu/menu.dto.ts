import { MenuStatsDto } from "./menu_stats.dto";

export class MenuDto{
    name:string;
    price:number;
    photoUrl:string;
    content:string;
    restaurantUid:string;
    isOnDiscount:boolean;
    discountAmount?:number;
    discountFinishDate?:string;
    menuId:string;
    stats:MenuStatsDto;
    tags:string[]
    boostExpireDate?:string;
    

    static toJson(data: MenuDto): any {
        return {
          "name": data.name,
          "price":data.price,
          "photoUrl": data.photoUrl,
          "content":data.content,
          "restaurantUid":data.restaurantUid,
          "isOnDiscount": data.isOnDiscount,
          "discountAmount":data.discountAmount,
          "discountFinishDate": data.discountFinishDate,
          "menuId":data.menuId,
          "stats":MenuStatsDto.toJson(data.stats),
          "tags":data.tags,
          "boostExpireDate":data.boostExpireDate,
        };
      }
    
      static fromJson(data: any): MenuDto {
        const object: MenuDto = new MenuDto();
        object.name = data['name'];
        object.price = data["price"];
        object.photoUrl = data['photoUrl'];
        object.content=data["content"];
        object.restaurantUid=data["restaurantUid"];
        object.isOnDiscount = data['isOnDiscount'];
        object.discountAmount = data["discountAmount"];
        object.discountFinishDate = data['discountFinishDate'];
        object.menuId=data["menuId"];
        object.stats=MenuStatsDto.fromJson(data["stats"]);
        object.tags = data["tags"];
        object.boostExpireDate = data['boostExpireDate'];
        return object;
      }
}