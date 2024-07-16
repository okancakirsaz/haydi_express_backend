import { OrderDto } from "./order.dto";

export class CancelOrderDto{
    order:OrderDto;
    reason:string;


    static toJson(data: CancelOrderDto): any {
        return {
          "order":OrderDto.toJson(data.order),
          "reason":data.reason,
        };
      }
    
      static fromJson(data: any): CancelOrderDto {
        const object: CancelOrderDto = new CancelOrderDto();
        object.order = OrderDto.fromJson(data["order"]);
        object.reason = data['reason'];
        return object;
      }
}


































