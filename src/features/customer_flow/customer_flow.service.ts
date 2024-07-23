import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { MenuDto } from '../../core/dt_objects/menu/menu.dto';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';
import { BoostRestaurantOrMenuDto } from 'src/core/dt_objects/advertisement/boost_restaurant_or_menu.dto';

@Injectable()
export class CustomerFlowService extends BaseService{

async getAdvertedMenus(category:string):Promise<MenuDto[]>{
    const query:any[] = await this.firebase.getDataWithOrderByAndWhereQueryLimited(FirebaseColumns.BOOSTED_MENUS,
        "boostArea","==",category,
        "expireDate", "desc", 
        10,
    );
    const queryAsDto:BoostRestaurantOrMenuDto[] = query.map((e)=> BoostRestaurantOrMenuDto.fromJson(e));

    
    return this.fetchMenuFromBoosts(queryAsDto);
}

private async fetchMenuFromBoosts(queryAsDto:BoostRestaurantOrMenuDto[]){
    const menuQuery:any[] = [];

    for(let i = 0;i<=queryAsDto.length-1;i++){
        const query:any = await this.firebase.getDataWithWhereQuery(FirebaseColumns.RESTAURANT_MENUS,
            "menuId","==", queryAsDto[i].elementId,
        )??[]; 
       if(query.length!=0){
        menuQuery.push(query[0]);
       }
    }
    let menuQueryAsDto:MenuDto[] = [];
    if(menuQuery.length!=0){
      menuQueryAsDto =  menuQuery.map((e)=>MenuDto.fromJson(e))
    }

    return menuQueryAsDto;
}

async getMoreAdvertedMenus(lastExpire:string,category:string){
    const queryRaw = await this.firebase.db.collection(FirebaseColumns.BOOSTED_MENUS)
    .where("boostArea","==",category)
    .where("expireDate","<",lastExpire)
    .orderBy("expireDate","desc").limit(10).get();

    const dataList:BoostRestaurantOrMenuDto[] = queryRaw.docs.map(doc => BoostRestaurantOrMenuDto.fromJson(doc.data()));
    return this.fetchMenuFromBoosts(dataList);
}


async discover(){
    let items:MenuDto[] = [];
    items = items.concat(await this.getNewRestaurantsMenus());
    items = items.concat(await this.getMenusFromLikeRatio(items));
    return items;
}

private async getNewRestaurantsMenus():Promise<MenuDto[]>{
    const restaurants = await this.firebase.db.collection(FirebaseColumns.RESTAURANTS)
    .orderBy("accountCreationDate","desc")
    .limit(5)
    .get();

    const restaurantsAsDto:RestaurantDto[] = restaurants.docs.map((e)=>RestaurantDto.fromJson(e.data()));
    const menusFromRestaurants:MenuDto[] = []
    for(let i=0;i<=5;i++){
        
        if(restaurantsAsDto[i]!=undefined){
           const menu = await this.firebase.db.collection(FirebaseColumns.RESTAURANT_MENUS)
           .where("restaurantUid","==",restaurantsAsDto[i].uid)
           .where("boostExpireDate","==",null)
           .limit(1)
           .get();
           if(menu.docs[0]!=null){
            const singleMenu:FirebaseFirestore.DocumentData = menu.docs[0].data();
            menusFromRestaurants.push(MenuDto.fromJson(singleMenu))
           }
        }
    }
    return menusFromRestaurants;
}

private async getMenusFromLikeRatio(alreadyExistItems:MenuDto[]):Promise<MenuDto[]>{
   const dbData =  await this.firebase.db.collection(FirebaseColumns.RESTAURANT_MENUS)
    .where("boostExpireDate","==",null)
    .orderBy("stats.likeRatio","desc")
    .limit(15)
    .get();
    let dataAsDto:MenuDto[] = dbData.docs.map((e)=>MenuDto.fromJson(e.data()));
    const existItems:string[] = this.setAlreadyExistItemsIdList(alreadyExistItems);

    dataAsDto= dataAsDto.filter((e)=>!existItems.includes(e.menuId));
    return dataAsDto;
}

private setAlreadyExistItemsIdList(alreadyExistItems:MenuDto[]):string[]{
let data:string[] = [];
for(let i=0;i<=alreadyExistItems.length-1;i++){
data.push(alreadyExistItems[i].menuId);
}
return data;
}


async moreDiscover(likeRatio:string){

    const parsedLikeRatio:number = Number.parseFloat(likeRatio)
    const dbData =  await this.firebase.db.collection(FirebaseColumns.RESTAURANT_MENUS)
    .where("boostExpireDate","==",null)
    .where("stats.likeRatio","<",parsedLikeRatio)
    .orderBy("stats.likeRatio","desc")
    .limit(15)
    .get();
    const alreadyExistRestaurants:MenuDto[] = await this.getNewRestaurantsMenus();
    const existItems:string[] = this.setAlreadyExistItemsIdList(alreadyExistRestaurants);
    let menuData:MenuDto[]= dbData.docs.map((e)=>MenuDto.fromJson(e.data()));
    menuData= menuData.filter((e)=>!existItems.includes(e.menuId));

    return menuData;
}


}

