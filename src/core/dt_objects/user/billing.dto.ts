export class BillingDto{
    date:string;
    businessId:string;
    amount:number;

    static toJson(data: BillingDto): any {
        return {
          "date":data.date,
          "businessId": data.businessId,
          "amount":data.amount,
        };
      }
    
      static fromJson(data: any): BillingDto {
        const object: BillingDto = new BillingDto();
        object.date = data["date"];
        object.businessId = data['businessId'];
        object.amount = data['amount'];
        return object;
      }
}