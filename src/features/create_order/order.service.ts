import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';

@Injectable()
export class OrderService extends BaseService{

    async isRestaurantsUsesHe(ids:string[]):Promise<boolean[]>{
        let finalValue:boolean[] = [];
        for(let i=0;i<=ids.length-1;i++){
           const restaurantData = await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,ids[i]);
           const asModel = RestaurantDto.fromJson(restaurantData);
           
           if(asModel.wantDeliveryFromUs){
            finalValue.push(true);
           }
           else{
            finalValue.push(false);
           }
        }
        return finalValue;
    }
}