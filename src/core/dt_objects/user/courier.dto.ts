export class CourierDto{
    nameSurname:string
    secureCode:string
    isWorking:boolean
    phoneNumber:string
    courierId:string
    workStartDate:string


    static toJson(data: CourierDto): any {
        return {
          "nameSurname": data.nameSurname,
          "secureCode": data.secureCode,
          "isWorking": data.isWorking,
          "phoneNumber": data.phoneNumber,
          "courierId": data.courierId,
          "workStartDate":data.workStartDate,
        };
      }
    
      static fromJson(data: any): CourierDto {
        const object: CourierDto = new CourierDto();
        object.nameSurname = data['nameSurname'];
        object.secureCode = data['secureCode'];
        object.isWorking = data['isWorking'];
        object.phoneNumber = data['phoneNumber'];
        object.courierId = data['courierId'];
        object.workStartDate = data["workStartDate"];
    
        return object;
      }
}