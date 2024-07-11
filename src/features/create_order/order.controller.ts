import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/core/guard/auth.guard';

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
}