import { RestaurantDto } from "../user/restaurant.dto";
import { CustomerDto } from "../user/customer.dto";

export class LogInDto {
    mail: string;
    password: string;
    isLoginSuccess:boolean
    unSuccessfulReason?:string
    restaurantData?:RestaurantDto
    customerData?:CustomerDto
    uid?:string
    accessToken?:string
    
    static toJson(data: LogInDto): any {
      return {
        "mail": data.mail,
        "password":data.password,
        "isLoginSuccess": data.isLoginSuccess,
        "unSuccessfulReason":data.unSuccessfulReason,
        "restaurantData":RestaurantDto.toJson(data.restaurantData),
        "customerData":CustomerDto.toJson(data.customerData),
        "uid":data.uid,
        "accessToken":data.accessToken
      };
    }
  
    static fromJson(data: any): LogInDto {
      const object: LogInDto = new LogInDto();
      object.mail = data['mail'];
      object.password = data["password"];
      object.isLoginSuccess = data['isLoginSuccess'];
      object.unSuccessfulReason=data["unSuccessfulReason"];
      object.restaurantData = RestaurantDto.fromJson(data['restaurantData'])
      object.customerData = CustomerDto.fromJson(data['customerData'])
      object.uid=data["uid"];
      object.accessToken=data["accessToken"];
      return object;
    }
  }
  