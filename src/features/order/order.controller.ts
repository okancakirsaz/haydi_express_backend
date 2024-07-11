import { Body, Controller, Get, HttpException, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { OrderDto } from 'src/core/dt_objects/order/order.dto';

@Controller('order')
export class OrderController{
constructor(private readonly service:OrderService){}
@UseGuards(AuthGuard)
@Post('is-restaurants-uses-he')
async isRestaurantsUsesHe(@Body() params:string[],):Promise<boolean[]>{
    try {
        return await this.service.isRestaurantsUsesHe(params);
    } catch (error) {
        throw Error(error);
    }
}

@Post('create-order')
async createOrder(@Body() params:OrderDto):Promise<boolean|HttpException>{
    try {
        return await this.service.createOrder(params);
    } catch (error) {
        throw Error(error);
    }
}
}