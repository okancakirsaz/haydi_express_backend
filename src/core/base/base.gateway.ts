import { Injectable } from "@nestjs/common";
import { MessageBody,WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ChatRoomDto } from "src/core/dt_objects/chat/chat_room.dto";

@Injectable()
@WebSocketGateway(3001)
export class BaseGateway{
@WebSocketServer()
public server;

sendNewChatData(@MessageBody() body:ChatRoomDto){
    this.server.emit(`New Chat:${body.isConversationStarterHelper?body.customerId:body.helperId}`,ChatRoomDto.toJson(body));
}
}