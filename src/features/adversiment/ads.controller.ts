import { Body, Controller, Get, HttpException, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { BoostMenuDto } from 'src/core/dt_objects/advertisement/boost_menu.dto';
import { BoostRestaurantOrMenuDto } from 'src/core/dt_objects/advertisement/boost_restaurant_or_menu.dto';

@Controller('advertisement')
export class AdsController{
constructor(private readonly service:AdsService){}

@UseGuards(AuthGuard)
@Post("get-new-advertisement")
async getNewAdvertisement(@Body() params:BoostMenuDto):Promise<boolean>{
    try {
    return this.service.getNewAdvertisement(params);
    } catch (error) {
    throw Error();
    }
}

@UseGuards(AuthGuard)
@Post("get-search-ad")
async getNewSearchAdvertisement(@Body() params:BoostRestaurantOrMenuDto):Promise<HttpException>{
    try {
    return this.service.getNewSearchAdvertisement(params);
    } catch (error) {
    throw Error();
    }
}
}