import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { BaseGateway } from "src/core/base/base.gateway";
import { ChatDto } from "src/core/dt_objects/chat/chat.dto";
import { ChatRoomDto } from "src/core/dt_objects/chat/chat_room.dto";
import { OrderDto } from "src/core/dt_objects/order/order.dto";

@Injectable()
export class ChatGateway extends BaseGateway{

sendNewChatData(@MessageBody() body:ChatRoomDto){
    this.server.emit(`New Chat:${body.isConversationStarterHelper?body.customerId:body.helperId}`,ChatRoomDto.toJson(body));
}
sendUpdateChatData(@MessageBody() body:ChatDto){
    this.server.emit(`Chat Update:${body.roomId}`,ChatDto.toJson(body));
}
sendRoomClosed(@MessageBody() body:ChatRoomDto){
    this.server.emit(`Room Closed:${body.roomId}`,ChatRoomDto.toJson(body));
}
}