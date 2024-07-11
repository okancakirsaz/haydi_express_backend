
export class RevenueDto{
    restaurantId:string;
    revenue:number;


    static toJson(data: RevenueDto): any {
        return {
          "restaurantId": data.restaurantId,
          "revenue":data.revenue,
        };
      }
    
      static fromJson(data: any): RevenueDto {
        const object: RevenueDto = new RevenueDto();
        object.restaurantId = data['restaurantId'];
        object.revenue=data["revenue"];
        return object;
      }
}


































