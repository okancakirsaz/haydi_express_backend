import { RestaurantDto } from "../user/restaurant.dto";

export class LogInDto {
    mail: string;
    password: string;
    isLoginSuccess:boolean
    unSuccessfulReason?:string
    restaurantData?:RestaurantDto
    uid?:string
    
    static toJson(data: LogInDto): any {
      return {
        "mail": data.mail,
        "password":data.password,
        "isLoginSuccess": data.isLoginSuccess,
        "unSuccessfulReason":data.unSuccessfulReason,
        "restaurantData":RestaurantDto.toJson(data.restaurantData),
        "uid":data.uid
      };
    }
  
    static fromJson(data: any): LogInDto {
      const object: LogInDto = new LogInDto();
      object.mail = data['mail'];
      object.password = data["password"];
      object.isLoginSuccess = data['isLoginSuccess'];
      object.unSuccessfulReason=data["unSuccessfulReason"];
      object.restaurantData = RestaurantDto.fromJson(data['restaurantData'])
      object.uid=data["uid"];
      return object;
    }
  }
  