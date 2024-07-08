import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { SuggestionDto } from '../../core/dt_objects/search/suggestion.dto';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { BoostRestaurantOrMenuDto } from 'src/core/dt_objects/advertisement/boost_restaurant_or_menu.dto';
import { MenuDto } from 'src/core/dt_objects/menu/menu.dto';
import { AdvertisementCategories } from 'src/core/constants/adversiment_categories';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';

@Injectable()
export class SearchService extends BaseService{

   async getSearchAds():Promise<SuggestionDto[]>{
    let suggestionList:SuggestionDto[] = [];

    const dbDataRestaurants:BoostRestaurantOrMenuDto[] = (await this.firebase
    .getDataWithWhereQuery(FirebaseColumns.BOOSTED_RESTAURANTS,"boostArea","==",AdvertisementCategories.suggestions)??[])
    .map((e)=>BoostRestaurantOrMenuDto.fromJson(e));

    const dbDataMenu:BoostRestaurantOrMenuDto[] = (await this.firebase
        .getDataWithWhereQuery(FirebaseColumns.BOOSTED_MENUS,"boostArea","==",AdvertisementCategories.suggestions)??[])
        .map((e)=>BoostRestaurantOrMenuDto.fromJson(e));
        
    const dbData:BoostRestaurantOrMenuDto[] = dbDataRestaurants.concat(dbDataMenu);
      
    for(let i=0;i<=dbData.length-1;i++){
    suggestionList.push(await this.fetchSuggestion(dbData[i].elementId,dbData[i].isRestaurant,true));
    }
    return suggestionList;
    
   } 

   private async fetchSuggestion(elementId:string,isRestaurant:boolean,isBoosted:boolean):Promise<SuggestionDto>{
    let suggestion:SuggestionDto=new SuggestionDto();
    suggestion.elementId=elementId;
    suggestion.isBoosted=isBoosted;
    suggestion.isRestaurant = isRestaurant;

    if(!isRestaurant){
     const menu:MenuDto = MenuDto.fromJson(await this.firebase.getDoc(FirebaseColumns.RESTAURANT_MENUS,suggestion.elementId));
     suggestion.isOnDiscount=menu.isOnDiscount;
     suggestion.name=menu.name;
     suggestion.discountAmount=menu.discountAmount??0;
     suggestion.price=menu.price;
    }
    else{
        const restaurant:RestaurantDto = 
        RestaurantDto.fromJson(await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,suggestion.elementId));
        suggestion.name= restaurant.businessName
        suggestion.isOnDiscount=false;
        suggestion.price=0;
        suggestion.discountAmount=0;
    }
    return suggestion;
   }

   async search(keyword:string):Promise<SuggestionDto[]>{
    const tagQueryResult:MenuDto[] = await this.queryByMenuTags(keyword);
    const menuSuggestions:SuggestionDto[] = await this.fetchMenuListAsSuggestionList(tagQueryResult);
    const restaurantNameQueryResult:RestaurantDto[] = await this.queryByRestaurantName(keyword);
    const restaurantSuggestions:SuggestionDto[] = await this.fetchRestaurantListAsSuggestionList(restaurantNameQueryResult);

    return menuSuggestions.concat(restaurantSuggestions);
   }

   private async fetchMenuListAsSuggestionList(menuList:MenuDto[]):Promise<SuggestionDto[]>{
    const data:SuggestionDto[] = [];
    for(let i=0;i<=menuList.length-1;i++){
        const menu:MenuDto = menuList[i];
        data.push(await this.fetchSuggestion(menu.menuId,false,false));
    }
    return data;
   }

   private async fetchRestaurantListAsSuggestionList(restaurantList:RestaurantDto[]):Promise<SuggestionDto[]>{
    const data:SuggestionDto[] = [];
    for(let i=0;i<=restaurantList.length-1;i++){
        const restaurant:RestaurantDto = restaurantList[i];
        data.push(await this.fetchSuggestion(restaurant.uid,true,false));
    }
    return data;
   }

   public async queryByMenuTags(keyword:string):Promise<MenuDto[]>{
    //All tags saved as lowercase to db on here because we don't fetch
    //lowercase on restaurant search.
    const response:Record<string,any>[] = await this.firebase
    .getDataWithWhereQueryLimited(FirebaseColumns.RESTAURANT_MENUS,
    "tags","array-contains",keyword.toLowerCase(),20
    );
    if(response!=null){
        return response.map((e)=>MenuDto.fromJson(e));
    }
    else{
        return [];
    }
   }

   private async queryByRestaurantName(keyword:string):Promise<RestaurantDto[]>{
    const response= (await this.firebase.db.collection(FirebaseColumns.RESTAURANTS)
    .where( "businessName",">=",keyword).where("businessName","<=",keyword+ '\uf8ff').get()).docs;
    
    if(response!=null){
        return response.map((e)=>RestaurantDto.fromJson(e.data()));
    }
    else{
        return [];
    }
   }
}