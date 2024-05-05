export class CommentDto {
    comment: string;
    like:    number;

    static toJson(data: CommentDto): any {
        return {
          "comment": data.comment,
          "like":data.like,
        };
      }
    
      static fromJson(data: any): CommentDto {
        const object: CommentDto = new CommentDto();
        object.comment = data['comment'];
        object.like = data["like"];
        return object;
      }

}
