import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';

@Injectable()
export class RestaurantService extends BaseService{
    async getRestaurant(restaurantId:string):Promise<RestaurantDto>{
        const data = RestaurantDto.fromJson(await this.firebase.getDoc(FirebaseColumns.RESTAURANTS,restaurantId));
        return data;
    }

}