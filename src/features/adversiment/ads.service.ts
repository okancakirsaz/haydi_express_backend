import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { BoostMenuDto } from 'src/core/dt_objects/advertisement/boost_menu.dto';
import { MenuDto } from 'src/core/dt_objects/menu/menu.dto';

@Injectable()
export class AdsService extends BaseService{

    async getNewAdvertisement(params:BoostMenuDto):Promise<boolean>{
        try {
        await this.firebase.setData(FirebaseColumns.BOOSTED_MENUS,params.menuId,BoostMenuDto.toJson(params));
        await this.setMenuExpireDate(params);
        return true;
        } catch (_) {
            return false;
        }
    }

    private async setMenuExpireDate(params:BoostMenuDto){
        const column:string = FirebaseColumns.RESTAURANT_MENUS;
        const menu:MenuDto = MenuDto.fromJson(await this.firebase.getDoc(column, params.menuId));
        menu.boostExpireDate = params.expireDate;
        await this.firebase.updateData(column,params.menuId,MenuDto.toJson(menu));
    }

}