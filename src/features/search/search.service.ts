import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { SuggestionDto } from '../../core/dt_objects/search/suggestion.dto';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { BoostRestaurantOrMenuDto } from 'src/core/dt_objects/advertisement/boost_restaurant_or_menu.dto';
import { MenuDto } from 'src/core/dt_objects/menu/menu.dto';
import { AdvertisementCategories } from 'src/core/constants/adversiment_categories';

@Injectable()
export class SearchService extends BaseService{

   async getSearchAds():Promise<SuggestionDto[]>{
    let suggestionList:SuggestionDto[] = [];
    
    const dbDataRestaurants:BoostRestaurantOrMenuDto[] = (await this.firebase
    .getDataWithWhereQuery(FirebaseColumns.BOOSTED_RESTAURANTS,"boostArea","==",AdvertisementCategories.suggestions)??[])
    .map((e)=>BoostRestaurantOrMenuDto.fromJson(e));
    console.log(dbDataRestaurants) 
    const dbDataMenu:BoostRestaurantOrMenuDto[] = (await this.firebase
        .getDataWithWhereQuery(FirebaseColumns.BOOSTED_MENUS,"boostArea","==",AdvertisementCategories.suggestions)??[])
        .map((e)=>BoostRestaurantOrMenuDto.fromJson(e));
        
    const dbData:BoostRestaurantOrMenuDto[] = dbDataRestaurants.concat(dbDataMenu);
      
    for(let i=0;i<=dbData.length-1;i++){
    suggestionList.push(await this.fetchSuggestion(dbData[i]));
    }
    return suggestionList;
   } 

   private async fetchSuggestion(data:BoostRestaurantOrMenuDto):Promise<SuggestionDto>{
    let suggestion:SuggestionDto=new SuggestionDto();
    suggestion.elementId=data.elementId;
    suggestion.isBoosted=true;
    suggestion.isRestaurant = data.isRestaurant;

    if(!data.isRestaurant){
     const menu:MenuDto = MenuDto.fromJson(await this.firebase.getDoc(FirebaseColumns.RESTAURANT_MENUS,suggestion.elementId));
     suggestion.isOnDiscount=menu.isOnDiscount;
     suggestion.discountAmount=menu.discountAmount??0;
    }
    else{
        suggestion.isOnDiscount=false;
        suggestion.discountAmount=0;
    }
    return suggestion;
   }
}