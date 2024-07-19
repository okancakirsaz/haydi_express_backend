import { Body, Controller, Get, HttpException, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { OrderDto } from 'src/core/dt_objects/order/order.dto';
import { CancelOrderDto } from 'src/core/dt_objects/order/cancel_order.dto';

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

@UseGuards(AuthGuard)
@Get("restaurant-active-orders")
async restaurantActiveOrders(@Query("restaurantId") restaurantId:string):Promise<OrderDto[]>{
    try {
      return this.service.restaurantActiveOrders(restaurantId);  
    } catch (error) {
      throw Error();
    }
}

@UseGuards(AuthGuard)
@Get("customer-active-orders")
async customerActiveOrders(@Query("customerId") customerId:string):Promise<OrderDto[]>{
    try {
      return this.service.customerActiveOrders(customerId);  
    } catch (error) {
      throw Error();
    }
}

@UseGuards(AuthGuard)
@Post('update-order-state')
async updateOrderState(@Body() params:OrderDto):Promise<boolean|HttpException>{
    try {
        return await this.service.updateOrderState(params);
    } catch (error) {
        throw Error(error);
    }
}

@UseGuards(AuthGuard)
@Get("restaurant-order-logs")
async getOrderLogs(@Query("restaurantId") restaurantId:string,@Query("dateRange") dateRange:string):Promise<OrderDto[]>{
    try {
      return await this.service.getOrderLogs(restaurantId,JSON.parse(dateRange));  
    } catch (error) {
      throw Error();
    }
}

@UseGuards(AuthGuard)
@Get("customer-order-logs")
async getOrderLogsForCustomer(@Query("restaurantId") restaurantId:string):Promise<OrderDto[]>{
    try {
      return await this.service.getOrderLogsForCustomer(restaurantId);  
    } catch (error) {
      throw Error();
    }
}

@UseGuards(AuthGuard)
@Post('cancel-order')
async cancelOrder(@Body() params:CancelOrderDto):Promise<boolean|HttpException>{
    try {
        return await this.service.cancelOrder(params);
    } catch (error) {
        throw Error(error);
    }
}
}