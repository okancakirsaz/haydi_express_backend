import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { AdvertisementCategories } from 'src/core/constants/adversiment_categories';
import { MenuDto } from 'src/core/dt_objects/menu/menu.dto';
import { BoostRestaurantOrMenuDto } from '../../core/dt_objects/advertisement/boost_restaurant_or_menu.dto';

@Injectable()
export class AdsService extends BaseService{

    async getNewAdvertisement(params:BoostRestaurantOrMenuDto):Promise<HttpException>{
        try {
        const column:string = params.isRestaurant?FirebaseColumns.BOOSTED_RESTAURANTS:FirebaseColumns.BOOSTED_MENUS;
        if(params.boostArea==AdvertisementCategories.suggestions){
            return await this.getNewSearchAdvertisement(params,column);
        }
        else{
            return this.getRegularAdvertisement(params,column);
        } 
    }
    catch (_) {
        return new HttpException("Beklenmeyen bir sorun oluştu.",HttpStatus.BAD_REQUEST);
    }

    }
    private async getRegularAdvertisement(params:BoostRestaurantOrMenuDto,column:string):Promise<HttpException>{
        await this.firebase.setData(column,params.elementId,BoostRestaurantOrMenuDto.toJson(params));
        if(!params.isRestaurant){
            await this.setMenuExpireDate(params.elementId,params.expireDate);
        }
        return new HttpException("Reklam başarılı bir şekilde alındı.",HttpStatus.ACCEPTED);
        } 

    private async setMenuExpireDate(menuId:string,expireDate:string){
        const column:string = FirebaseColumns.RESTAURANT_MENUS;
        const menu:MenuDto = MenuDto.fromJson(await this.firebase.getDoc(column, menuId));
        menu.boostExpireDate = expireDate;
        await this.firebase.updateData(column,menuId,MenuDto.toJson(menu));
    }

    private async getNewSearchAdvertisement(params:BoostRestaurantOrMenuDto,column:string):Promise<HttpException>{
        const isRestaurantExist:boolean = await this.checkIsRestaurantExist(params.restaurantId);
        if(isRestaurantExist){
        return new HttpException("Bu alana aynı anda birden fazla reklam alınamaz.",HttpStatus.CONFLICT);
        }
        await this.firebase.setData(column,params.elementId,BoostRestaurantOrMenuDto.toJson(params));
        if(!params.isRestaurant){
            await this.setMenuExpireDate(params.elementId,params.expireDate);
        }
        return new HttpException("Reklam başarılı bir şekilde alındı.",HttpStatus.ACCEPTED);
    }

    private async  checkIsRestaurantExist(restaurantId:string):Promise<boolean>{
        const boostedRestaurants = await this.firebase.getDataWithWhereQuery(FirebaseColumns.BOOSTED_RESTAURANTS,"restaurantId","==",restaurantId)??[];
        const boostedMenus = await this.firebase.getDataWithWhereQuery(FirebaseColumns.BOOSTED_MENUS,"restaurantId","==",restaurantId)??[];

        if(boostedRestaurants.length>=1||boostedMenus.length>=1){
        return true;
        }
        else{
        return false;
        }
    }

}