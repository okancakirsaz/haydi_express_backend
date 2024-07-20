import { ChatLinkDto } from "./chat_link.dto";

export class ChatDto{
    owner:string;
    roomId:string;
    content:string;
    link?:ChatLinkDto;

    static toJson(data: ChatDto): any {
        return {
          "owner":data.owner,
          "roomId":data.roomId,
          "content": data.content,
          "link":data.link!=null? ChatLinkDto.toJson(data.link):null,
        };
      }
    
      static fromJson(data: any): ChatDto {
        const object: ChatDto = new ChatDto();
        object.owner = data["owner"];
        object.roomId = data["roomId"];
        object.content = data['content'];
        object.link = data['link']!=null? ChatLinkDto.fromJson(data['link']):null;
        return object;
      }
}