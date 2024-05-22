import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { MenuDto } from '../../core/dt_objects/menu/menu.dto';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { BoostMenuDto } from '../../core/dt_objects/advertisement/boost_menu.dto';

@Injectable()
export class CustomerFlowService extends BaseService{

async getAdvertedMenus(category:string):Promise<MenuDto[]>{
    const query:any[] = await this.firebase.getDataWithOrderByAndWhereQueryLimited(FirebaseColumns.BOOSTED_MENUS,
        "boostArea","==",category,
        "expireDate", "desc", 
        10,
    );
    const queryAsDto:BoostMenuDto[] = query.map((e)=> BoostMenuDto.fromJson(e));

    
    return this.fetchMenuFromBoosts(queryAsDto);
}

private async fetchMenuFromBoosts(queryAsDto:BoostMenuDto[]){
    const menuQuery:any[] = [];

    for(let i = 0;i<=queryAsDto.length-1;i++){
        const query:any = await this.firebase.getDataWithWhereQuery(FirebaseColumns.RESTAURANT_MENUS,
            "menuId","==", queryAsDto[i].menuId,
        ); 
        menuQuery.push(query[0]);
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

    const dataList:BoostMenuDto[] = queryRaw.docs.map(doc => BoostMenuDto.fromJson(doc.data()));
    return this.fetchMenuFromBoosts(dataList);
}


}