import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { ChatRoomDto } from 'src/core/dt_objects/chat/chat_room.dto';
import { ChatGateway } from './chat.gateway';
import { ChatDto } from 'src/core/dt_objects/chat/chat.dto';

@Injectable()
export class ChatService extends BaseService{
    constructor(private readonly gateway: ChatGateway) {
        super();
      }
    

    async createRoom(roomData:ChatRoomDto):Promise<boolean>{
       try {
        await this.firebase.setData(FirebaseColumns.CHAT_ROOMS,roomData.roomId,ChatRoomDto.toJson(roomData));
        this.gateway.sendNewChatData(roomData);
        return true;
       } catch (error) {
        console.log(error);
        return false;
       }
    }

    async updateRoom(chatElement:ChatDto):Promise<boolean>{
       try {
        const column:string = FirebaseColumns.CHAT_ROOMS;
        let room:ChatRoomDto = ChatRoomDto.fromJson(await this.firebase.getDoc(column,chatElement.roomId));
        room.content.push(chatElement);
        await this.firebase.updateData(column,room.roomId,ChatRoomDto.toJson(room));
        this.gateway.sendUpdateChatData(chatElement);
        return true;
       } catch (error) {
        return false;
       }
    }


    async closeRoom(roomId:string):Promise<boolean>{
        try {
         const column:string = FirebaseColumns.CHAT_ROOMS;
         let room:ChatRoomDto = ChatRoomDto.fromJson(await this.firebase.getDoc(column,roomId));
         room.isRoomClosed=true;
         await this.firebase.updateData(column,room.roomId,ChatRoomDto.toJson(room));
         this.gateway.sendRoomClosed(room);
         return true;
        } catch (error) {
         return false;
        }
     }
}