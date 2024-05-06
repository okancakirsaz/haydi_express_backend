import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { FirebaseServices } from "../firebase_services";
import { BaseService } from "src/core/base/base_service";
import { MenuDto } from "src/core/dt_objects/menu/menu.dto";


@Injectable()
export class CronjobService extends BaseService{

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyCron() {
    await this.checkMenuCampaignsIsExpired();
  }
  
  private async checkMenuCampaignsIsExpired() {
    //currentTime like this: '2024-02-12T18:28:18+03:00'
    const currentDate:string = new Date().toISOString();
    const column:string = FirebaseColumns.RESTAURANT_MENUS;
    const campaignList = await this.firebase.getDataWithWhereQuery(column,"discountFinishDate","<=",currentDate);
    if(campaignList!=null){
        for(let i = 0;i<=campaignList.length-1;i++){
            const campaignAsDto:MenuDto = MenuDto.fromJson(campaignList[i]);
            campaignAsDto.isOnDiscount=false;
            campaignAsDto.discountFinishDate=null;
            campaignAsDto.discountAmount=null;
            await this.firebase.updateData(column,campaignAsDto.menuId,MenuDto.toJson(campaignAsDto));
        }
    }
  }


  //TODO: Make tax payment cronjob
}