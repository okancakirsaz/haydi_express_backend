import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { BoostMenuDto } from 'src/core/dt_objects/advertisement/boost_menu.dto';
import { MenuDto } from 'src/core/dt_objects/menu/menu.dto';
import { BoostRestaurantOrMenuDto } from '../../core/dt_objects/advertisement/boost_restaurant_or_menu.dto';

@Injectable()
export class AdsService extends BaseService{

    async getNewAdvertisement(params:BoostMenuDto):Promise<boolean>{
        try {
        await this.firebase.setData(FirebaseColumns.BOOSTED_MENUS,params.menuId,BoostMenuDto.toJson(params));
        await this.setMenuExpireDate(params.menuId,params.expireDate);
        return true;
        } catch (_) {
            return false;
        }
    }

    private async setMenuExpireDate(menuId:string,expireDate:string){
        const column:string = FirebaseColumns.RESTAURANT_MENUS;
        const menu:MenuDto = MenuDto.fromJson(await this.firebase.getDoc(column, menuId));
        menu.boostExpireDate = expireDate;
        await this.firebase.updateData(column,menuId,MenuDto.toJson(menu));
    }

    async getNewSearchAdvertisement(params:BoostRestaurantOrMenuDto):Promise<HttpException>{
        try {
        const column = FirebaseColumns.SEARCH_BOOSTS;
        const isRestaurantExist:boolean = await this.checkIsRestaurantExist(column,params.restaurantId);
        if(isRestaurantExist){
        return new HttpException("Bu alana aynı anda birden fazla reklam alınamaz.",HttpStatus.CONFLICT);
        }
        await this.firebase.setData(column,params.elementId,BoostRestaurantOrMenuDto.toJson(params));
        if(!params.isRestaurant){
        await this.setMenuExpireDate(params.elementId,params.expireDate);
        }

        return new HttpException("Reklam başarılı bir şekilde alındı.",HttpStatus.ACCEPTED);;
        } catch (_) {
        console.log(_)
        return new HttpException("Beklenmeyen bir sorun oluştu.",HttpStatus.BAD_REQUEST);;
        }
    }

    private async  checkIsRestaurantExist(column:string,restaurantId:string):Promise<boolean>{
        const restaurant = await this.firebase.getDataWithWhereQuery(column,"restaurantId","==",restaurantId)??[];
        if(restaurant.length>=1){
        return true;
        }
        else{
        return false;
        }
    }

}