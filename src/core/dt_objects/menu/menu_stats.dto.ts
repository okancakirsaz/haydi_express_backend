import { CommentDto } from "../public/comment.dto";

export class MenuStatsDto {
    creationDate:        string;
    totalOrderCount:     number;
    likeRatio:           number;
    mostOrderTakingHour: string;
    totalRevenue:        number;
    comments:            CommentDto[];

    static toJson(data: MenuStatsDto): any {
        let commentsAsJson:Record<string,any>[] = [];

        for(let i =0;i<=data.comments.length-1;i++){
            commentsAsJson.push(CommentDto.toJson(data.comments[i]));
        }

        return {
          "creationDate": data.creationDate,
          "totalOrderCount":data.totalOrderCount,
          "likeRatio": data.likeRatio,
          "mostOrderTakingHour":data.mostOrderTakingHour,
          "totalRevenue":data.totalRevenue,
          "comments": commentsAsJson,
        };
      }
    
      static fromJson(data: any): MenuStatsDto {

        let commentsAsDto:CommentDto[] = [];

        for(let i =0;i<=data.comments.length-1;i++){
            commentsAsDto.push(CommentDto.fromJson(data["comments"][i]));
        }

        const object: MenuStatsDto = new MenuStatsDto();
        object.creationDate = data['creationDate'];
        object.totalOrderCount = data["totalOrderCount"];
        object.likeRatio = data['likeRatio'];
        object.mostOrderTakingHour=data["mostOrderTakingHour"];
        object.totalRevenue=data["totalRevenue"];
        object.comments = commentsAsDto;
        
        return object;
      }
}
