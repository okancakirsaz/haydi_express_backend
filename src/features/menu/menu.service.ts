import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base_service";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { MenuDto } from "src/core/dt_objects/menu/menu.dto";

@Injectable()

export class MenuService extends BaseService{

    async createMenu(params:MenuDto,file:Express.Multer.File):Promise<MenuDto>{
        const fileUrl:string = await this.firebase.uploadFileToFirestore(params.restaurantUid,"menu",params.menuId,file);
        params.photoUrl = fileUrl;
        await this.firebase.setData(FirebaseColumns.RESTAURANT_MENUS,params.menuId,MenuDto.toJson(params));
        return params;
    }


    async getRestaurantMenu(id:string):Promise<any[]>{
        return await this.firebase.getDataWithWhereQuery(FirebaseColumns.RESTAURANT_MENUS,"restaurantUid","==",id);
    }
}