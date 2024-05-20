import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FlowCategories } from 'src/core/constants/flow_categories';
import { MenuDto } from '../menu/menu.dto';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { BoostMenuDto } from '../advertisement/boost_menu.dto';

@Injectable()
export class CustomerFlowService extends BaseService{

    private readonly flowCategories:FlowCategories = new FlowCategories();

async getHaydiFirsatlar():Promise<MenuDto[]>{
    const query:any[] = await this.firebase.getDataWithWhereQueryLimited(FirebaseColumns.BOOSTED_MENUS,
        "boostArea","==",
        this.flowCategories.haydiFirsatlar,
        10
    );
    const queryAsDto:BoostMenuDto[] = query.map((e)=> BoostMenuDto.fromJson(e));

    const menuQuery:any[] = [];

    for(let i = 0;i<=queryAsDto.length-1;i++){
        const query:any = await this.firebase.getDataWithWhereQuery(FirebaseColumns.RESTAURANT_MENUS,
            "menuId","==", queryAsDto[i].menuId);
        menuQuery.push(query[0]);
    }
    let menuQueryAsDto:MenuDto[] = [];
    if(menuQuery.length!=0){
      menuQueryAsDto =  menuQuery.map((e)=>MenuDto.fromJson(e))
    }
    return menuQueryAsDto;
}

}