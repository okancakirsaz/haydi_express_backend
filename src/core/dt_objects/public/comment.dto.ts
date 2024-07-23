export class CommentDto {
    comment: string;
    restaurantId: string;
    menuId: string;
    uid: string;
    customerId: string;
    like:    number;

    static toJson(data: CommentDto): any {
        return {
          "comment": data.comment,
          "restaurantId": data.restaurantId,
          "menuId": data.menuId,
          "uid": data.uid,
          "customerId": data.customerId,
          "like":data.like,
        };
      }
    
      static fromJson(data: any): CommentDto {
        const object: CommentDto = new CommentDto();
        object.comment = data['comment'];
        object.restaurantId = data['restaurantId'];
        object.menuId = data['menuId'];
        object.uid = data['uid'];
        object.customerId = data['customerId'];
        object.like = data["like"];
        return object;
      }

}
