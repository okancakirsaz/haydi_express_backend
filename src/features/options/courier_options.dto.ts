export class CourierOptionsDto{
    revenuePerPackage:number


    static toJson(data: CourierOptionsDto): any {
        return {
          "revenuePerPackage": data.revenuePerPackage,
        };
      }
    
      static fromJson(data: any): CourierOptionsDto {
        const object: CourierOptionsDto = new CourierOptionsDto();
        object.revenuePerPackage = data['revenuePerPackage'];
        return object;
      }
}