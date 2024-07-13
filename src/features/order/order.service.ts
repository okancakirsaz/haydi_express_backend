import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { OrderDto } from 'src/core/dt_objects/order/order.dto';
import { RestaurantDto } from 'src/core/dt_objects/user/restaurant.dto';
import {PaymentMethods} from 'src/core/constants/payment_methods';
import { PaymentDto } from 'src/core/dt_objects/order/payment.dto';
import { OrderGateway } from './order_gateway';

@Injectable()
export class OrderService extends BaseService{

    constructor(private readonly gateway:OrderGateway){
        super();
    }

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


    async createOrder(params:OrderDto):Promise<boolean|HttpException>{
        try {
            const column:string = FirebaseColumns.ORDERS;
            await this.firebase.setData(column,params.orderId,OrderDto.toJson(params));
            if(params.paymentMethod == PaymentMethods.online){
              return await this.onlinePaymentProcess(params);
            }
            else{
                this.newOrderStream(params);
                return true;
            }
        } catch (error) {
            console.log(error);
            return new HttpException("Bilinmeyen bir hata oluştu.",HttpStatus.BAD_GATEWAY);
        }

    }

     newOrderStream(params:OrderDto){
        //TODO: Add operation panel part
        
            this.gateway.newRestaurantOrder(params,params.restaurantId);
        
    }

    private async getPaid(paymentData:PaymentDto):Promise<boolean|HttpException>{
        try {
        //TODO: Create payment gateway
        return true;
        } catch (error) {
        return new HttpException(error,HttpStatus.BAD_GATEWAY);
        }
    }
    private async onlinePaymentProcess(params:OrderDto):Promise<boolean|HttpException>{
        const column:string =FirebaseColumns.ORDERS;
        const isPaidSuccess:boolean|HttpException = await this.getPaid(params.paymentData);
        if(isPaidSuccess==true){
            params.isPaidSuccess=isPaidSuccess as boolean;
            await this.firebase.updateData(column,params.orderId,OrderDto.toJson(params));
            this.newOrderStream(params);
            return true;
        }
        else{
            await this.firebase.deleteDoc(FirebaseColumns.ORDERS,params.orderId);
            return isPaidSuccess as HttpException;
        }
    }


    async restaurantActiveOrders(restaurantId:string):Promise<OrderDto[]>{
        const dbQuery = await this.firebase.getDataWithWhereQuery(FirebaseColumns.ORDERS,"restaurantId","==",restaurantId);
        const transportedQuery:OrderDto[] = dbQuery.map((e)=>OrderDto.fromJson(e));
        const filteredQuery:OrderDto[] = transportedQuery.filter((e)=>{
            if(e.isPaidSuccess==null||e.isPaidSuccess){
                return e;
            }
        });

        return filteredQuery;
    }
}