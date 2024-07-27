import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { CommentDto } from 'src/core/dt_objects/public/comment.dto';
import { WorkHoursDto } from 'src/core/dt_objects/public/work_hours.dto';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';

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

    async getRestaurantWorkHours(restaurantId:string):Promise<WorkHoursDto>{
        const restaurant = await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,restaurantId);
        const asModel = RestaurantDto.fromJson(restaurant);
        return asModel.workHours;
    }
}