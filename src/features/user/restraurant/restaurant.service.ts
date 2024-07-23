import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { CommentDto } from 'src/core/dt_objects/public/comment.dto';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';

@Injectable()
export class RestaurantService extends BaseService{

    async getRestaurant(restaurantId:string):Promise<RestaurantDto>{
        const restaurant = await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,restaurantId);
        const asModel = RestaurantDto.fromJson(restaurant);
        //Make un visible sensitive data's.
        asModel.password="hidden";
        asModel.email="hidden";
        asModel.cardCvv="hidden";
        asModel.cardNumber="hidden";
        asModel.cardExpirationDate="hidden";
        asModel.cardOwner="hidden";
        asModel.bankName="hidden";
        asModel.ibanNumber="hidden";
        asModel.taxNumber="hidden";
        asModel.phoneNumber="hidden";
        return asModel;
    }
}