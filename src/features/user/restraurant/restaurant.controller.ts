import { Body, Controller, Delete, Get, HttpException, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';
import { CommentDto } from 'src/core/dt_objects/public/comment.dto';
import { WorkHoursDto } from 'src/core/dt_objects/public/work_hours.dto';
import { BillingDto } from 'src/core/dt_objects/user/billing.dto';

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

@UseGuards(AuthGuard)
@Get('get-restaurant-all-data')
async getRestaurantAllData(@Query("restaurantId") restaurantId:string):Promise<RestaurantDto>{
    try {
        return await this.service.getRestaurantAllData(restaurantId);
    } catch (error) {
        throw Error(error);
    }
}

@UseGuards(AuthGuard)
@Get('get-restaurant-old-billings')
async getRestaurantOldBillings(@Query("restaurantId") restaurantId:string):Promise<BillingDto[]>{
    try {
        return await this.service.getRestaurantOldBillings(restaurantId);
    } catch (error) {
        throw Error(error);
    }
}

@UseGuards(AuthGuard)
@Get('get-restaurant-work-hours')
async getRestaurantWorkHours(@Query("restaurantId") restaurantId:string):Promise<WorkHoursDto>{
    try {
        return await this.service.getRestaurantWorkHours(restaurantId);
    } catch (error) {
        throw Error(error);
    }
}

@UseGuards(AuthGuard)
@Post('set-work-hours')
async setWorkHours(@Body() params:WorkHoursDto, @Query("restaurantId") restaurantId:string):Promise<boolean>{
try {
return await this.service.setWorkHours(params,restaurantId);
}
catch (error) {
throw Error(error);
}
}
}