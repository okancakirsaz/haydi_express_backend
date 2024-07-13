import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OrderDto } from "src/core/dt_objects/order/order.dto";

@Injectable()
@WebSocketGateway()
export class OrderGateway{
@WebSocketServer()
public server;

newRestaurantOrder(@MessageBody() body:OrderDto,restaurantId:string){
    this.server.emit(`New Order:${restaurantId}`,OrderDto.toJson(body));
}
}