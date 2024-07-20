export class ChatLinkDto{
    name:string;
    id:string;

    static toJson(data: ChatLinkDto): any {
        return {
          "name":data.name,
          "id": data.id,
        };
      }
    
      static fromJson(data: any): ChatLinkDto {
        const object: ChatLinkDto = new ChatLinkDto();
        object.name = data["name"];
        object.id = data['id'];
        return object;
      }
}