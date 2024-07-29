import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { CommentDto } from 'src/core/dt_objects/public/comment.dto';
import { WorkHoursDto } from 'src/core/dt_objects/public/work_hours.dto';
import { BillingDto } from 'src/core/dt_objects/user/billing.dto';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';
import { MailServices } from 'src/core/services/mail_services';

@Injectable()
export class RestaurantService extends BaseService{

    async getRestaurant(restaurantId:string):Promise<RestaurantDto>{
        const restaurant = await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,restaurantId);
        const asModel = RestaurantDto.fromJson(restaurant);
        //Make un visible sensitive data's.
        asModel.password="hidden";
        asModel.email="hidden";
        asModel.payment.cvv="hidden";
        asModel.payment.cardNumber="hidden";
        asModel.payment.expireDate="hidden";
        asModel.payment.cardHolder="hidden";
        asModel.bankName="hidden";
        asModel.ibanNumber="hidden";
        asModel.taxNumber="hidden";
        asModel.phoneNumber="hidden";
        return asModel;
    }

    async getRestaurantAllData(restaurantId:string):Promise<RestaurantDto>{
        const restaurant = await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,restaurantId);
        const asModel = RestaurantDto.fromJson(restaurant);
        return asModel;
    }

    async getRestaurantWorkHours(restaurantId:string):Promise<WorkHoursDto>{
        const restaurant = await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,restaurantId);
        const asModel = RestaurantDto.fromJson(restaurant);
        return asModel.workHours;
    }


    async setWorkHours(params:WorkHoursDto,restaurantId:string):Promise<boolean>{
        try {
        const restaurant = await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,restaurantId);
        const asModel = RestaurantDto.fromJson(restaurant);
        asModel.workHours=params;
        await this.firebase.updateData(FirebaseColumns.RESTAURANTS,restaurantId,RestaurantDto.toJson(asModel));
        return true;
        } catch (error) {
        return false;
        }
    }

    async getRestaurantOldBillings(restaurantId:string):Promise<BillingDto[]>{
        return ((await this.logDatabase.db.collection("BILLINGS").where("businessId","==",restaurantId).get()).docs.map((e)=>e.data())).map((e)=> BillingDto.fromJson(e));
    }

    //This function calling in cronjob_service.ts
    async restaurantBillings(){
        const restaurants:RestaurantDto[] = (await this.firebase.getDataWithWhereQuery(FirebaseColumns.RESTAURANTS,"accountCreationDate","<=",this.getSixMonthsBeforeAsIsoString(),)??[]).map((e)=> RestaurantDto.fromJson(e));
        for (let i:number = 0; i <= restaurants.length-1; i++) {
            const element = restaurants[i];
            if(this.checkIsRestaurantHaveBills(element)){
                await this.getPayment(element);
            }
        }
    }

    private getSixMonthsBeforeAsIsoString():string{
        const currentDate = new Date();
        const targetMonth = (currentDate.getMonth() - 6) % 12;
        const targetYear = currentDate.getFullYear() + Math.floor((currentDate.getMonth() - 6) / 12);
        const targetDate = new Date(targetYear, targetMonth, currentDate.getDate());
        return targetDate.toISOString();
    }

    private async getPayment(data:RestaurantDto){
        try {
        //TODO: Do payment process.
        await this.setNewPaymentDateAndTakeLog(data);
        } catch (error) {
        new MailServices().sendPaymentErrorMail(`${data.businessName} işletmesinden ${data.nextPaymentDate} tarihli komisyon ödemesini alırken bir sorun oluştu. Hata: ${error}`)
        }
    }

    private async setNewPaymentDateAndTakeLog(data:RestaurantDto){
        const totalOwe = data.bills;
        const dateObj= new Date();
        const currentDate = new Date(dateObj.getFullYear(),dateObj.getMonth(),dateObj.getDate(),0,0,0,0).toISOString();
        const oneMonthLater = new Date(dateObj.getFullYear(),dateObj.getMonth()+1,dateObj.getDate(),0,0,0,0).toISOString();
        data.lastPaymentDate = currentDate;
        data.nextPaymentDate = oneMonthLater;
        data.bills = 0;
        await this.firebase.updateData(FirebaseColumns.RESTAURANTS,data.uid,RestaurantDto.toJson(data));
        const log:BillingDto = new BillingDto();
        log.amount = totalOwe;
        log.businessId=data.uid;
        log.date = currentDate;
        await this.logDatabase.db.collection("BILLINGS").doc(log.date).set(BillingDto.toJson(log))
    }

    private checkIsRestaurantHaveBills(data:RestaurantDto):boolean{
        const dateObj= new Date();
        const currentDate = new Date(dateObj.getFullYear(),dateObj.getMonth(),dateObj.getDate(),0,0,0,0).toISOString();
        if(currentDate >= data.nextPaymentDate){
         return true;
        }
        return false;
    }
}