import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { BaseGateway } from "src/core/base/base.gateway";
import { OrderDto } from "src/core/dt_objects/order/order.dto";

@Injectable()
export class OrderGateway extends BaseGateway{


newRestaurantOrder(@MessageBody() body:OrderDto,restaurantId:string){
    this.server.emit(`New Order:${restaurantId}`,OrderDto.toJson(body));
}

newHubOrder(@MessageBody() body:OrderDto){
    this.server.emit("Hub Order",OrderDto.toJson(body));
}

orderUpdate(@MessageBody() body:OrderDto,orderId:string){
    this.server.emit(orderId,OrderDto.toJson(body));
    if(body.courierId!=null&&body.orderState=="Kuryeden Onay Bekleniyor"){
        this.server.emit(body.courierId,OrderDto.toJson(body));
    }
}
}