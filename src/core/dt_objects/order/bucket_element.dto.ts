import { MenuDto } from "../menu/menu.dto";

export class BucketElementDto{
    menuElement:MenuDto;
    count:number;

    static toJson(data: BucketElementDto): any {
        return {
          "menuElement":MenuDto.toJson(data.menuElement),
          "count": data.count,
        };
      }
    
      static fromJson(data: any): BucketElementDto {
        const object: BucketElementDto = new BucketElementDto();
        object.menuElement = MenuDto.fromJson(data["menuElement"]);
        object.count = data['count'];
        return object;
      }
}


































