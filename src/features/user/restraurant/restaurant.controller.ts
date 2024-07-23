import { Body, Controller, Delete, Get, HttpException, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';
import { CommentDto } from 'src/core/dt_objects/public/comment.dto';

@Controller('restaurant')
export class RestaurantController{
constructor(private readonly service:RestaurantService){
}

@UseGuards(AuthGuard)
@Get('get-restaurant')
async getRestaurant(@Query("restaurantId") restaurantId:string):Promise<RestaurantDto>{
    try {
        return await this.service.getRestaurant(restaurantId);
    } catch (error) {
        throw Error(error);
    }
}
}