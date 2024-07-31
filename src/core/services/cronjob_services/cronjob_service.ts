import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FirebaseColumns } from "src/core/constants/firebase_columns";
import { FirebaseServices } from "../firebase_services";
import { BaseService } from "src/core/base/base_service";
import { MenuDto } from "src/core/dt_objects/menu/menu.dto";
import { BoostRestaurantOrMenuDto } from "src/core/dt_objects/advertisement/boost_restaurant_or_menu.dto";
import { CancelOrderDto } from "src/core/dt_objects/order/cancel_order.dto";
import { RestaurantService } from "src/features/user/restraurant/restaurant.service";
import { HubAuthService } from "src/features/auth/service/hub_auth.service";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class CronjobService extends BaseService{

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyCron() {
    await this.checkMenuCampaignsIsExpired();
    await this.checkMenuBoostIsExpired();
    await this.checkRestaurantBoostIsExpired();
    await this.clearCancelledOrders();
    await new RestaurantService().restaurantBillings();
    await new HubAuthService(null).createDailyCredentials();
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

  private async checkMenuBoostIsExpired(){
    //currentTime like this: '2024-02-12T18:28:18+03:00'
    const currentDate:string = new Date().toISOString();
    const column:string = FirebaseColumns.RESTAURANT_MENUS;
    const campaignList = await this.firebase.getDataWithWhereQuery(column,"boostExpireDate","<=",currentDate);
    if(campaignList!=null){
        for(let i = 0;i<=campaignList.length-1;i++){
            const campaignAsDto:MenuDto = MenuDto.fromJson(campaignList[i]);
            campaignAsDto.boostExpireDate = null;
            await this.firebase.updateData(column,campaignAsDto.menuId,MenuDto.toJson(campaignAsDto));
            await this.firebase.deleteDoc(FirebaseColumns.BOOSTED_MENUS,campaignAsDto.menuId);
        }
    }
  }

  private async checkRestaurantBoostIsExpired(){
    //currentTime like this: '2024-02-12T18:28:18+03:00'
    const currentDate:string = new Date().toISOString();
    const column:string = FirebaseColumns.BOOSTED_RESTAURANTS;
    const campaignList = await this.firebase.getDataWithWhereQuery(column,"expireDate","<=",currentDate);
    if(campaignList!=null){
        for(let i = 0;i<=campaignList.length-1;i++){
            const campaignAsDto:BoostRestaurantOrMenuDto = BoostRestaurantOrMenuDto.fromJson(campaignList[i]);
            await this.firebase.deleteDoc(FirebaseColumns.BOOSTED_RESTAURANTS,campaignAsDto.elementId);
        }
    }
  }

  private async clearCancelledOrders(){
   const docs:CancelOrderDto[] =await (await this.firebase.getCollection(FirebaseColumns.CANCELLED_ORDERS)).map((e)=>CancelOrderDto.fromJson(e));
    for(let i:number =0;i<=docs.length-1;i++){
      await this.firebase.deleteDoc(FirebaseColumns.CANCELLED_ORDERS,docs[i].order.orderId);
    }
  }


  //TODO: Make tax payment cronjob
}