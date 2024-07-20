import { ChatDto } from "./chat.dto";

export class ChatRoomDto{
    roomId:string;
    customerId:string;
    customerName:string;
    helperId:string;
    helperName:string;
    isConversationStarterHelper:boolean;
    roomCreationDate:string;
    isRoomClosed:boolean;
    content:ChatDto[];

    static toJson(data: ChatRoomDto): any {
        return {
          "roomId":data.roomId,
          "customerId": data.customerId,
          "customerName": data.customerName,
          "helperId": data.helperId,
          "helperName": data.helperName,
          "roomCreationDate": data.roomCreationDate,
          "isRoomClosed": data.isRoomClosed,
          "isConversationStarterHelper": data.isConversationStarterHelper,
          "content": data.content.map((e)=>ChatDto.toJson(e)),
        };
      }
    
      static fromJson(data: any): ChatRoomDto {
        const object: ChatRoomDto = new ChatRoomDto();
        object.roomId = data["roomId"];
        object.customerId = data['customerId'];
        object.customerName = data['customerName'];
        object.helperId = data['helperId'];
        object.helperName = data['helperName'];
        object.roomCreationDate = data['roomCreationDate'];
        object.isRoomClosed = data['isRoomClosed'];
        object.isConversationStarterHelper = data['isConversationStarterHelper'];
        object.content = data['content'].map((e)=>ChatDto.fromJson(e));
        return object;
      }
}