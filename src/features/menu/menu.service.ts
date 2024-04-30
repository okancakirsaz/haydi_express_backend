import { Injectable } from "@nestjs/common";
import { BaseService } from "src/core/base/base_service";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { MenuDto } from "src/core/dt_objects/menu/menu.dto";

@Injectable()

export class MenuService extends BaseService{

    async createMenu(params:MenuDto,file:Express.Multer.File):Promise<MenuDto>{
        console.log(file)
        const fileUrl:string = await this.firebase.uploadFileToFirestore(params.restaurantUid,"menu",params.menuId,file);
        params.photoUrl = fileUrl;
        await this.firebase.setData(FirebaseColumns.RESTAURANT_MENUS,params.menuId,MenuDto.toJson(params));
        return params;
    }
}