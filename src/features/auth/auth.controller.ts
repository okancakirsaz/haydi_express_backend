import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.services";
import { RestaurantDto } from "src/core/dt_objects/user/restaurant.dto";
import { LogInDto } from "src/core/dt_objects/auth/log_in.dto";
import { ForgotPasswordDto } from "src/core/dt_objects/auth/forgot_password.dto";

//TODO: Import dto's.
@Controller('auth')
export class AuthController{
    constructor(private readonly service:AuthService){}

    @Post('sign-up-restaurant')
    async signUpAsRestaurant(@Body() params:RestaurantDto):Promise<RestaurantDto>{
    try {
    return await this.service.signUpAsRestaurant(params);
    } catch (error) {
    throw Error(error);
    }
    }
    @Post("log-in-restaurant")
    async logInAsRestaurant(@Body() params:LogInDto){
        try {
            return await this.service.logInAsRestaurant(params);
        } catch (error) {
            throw Error(error)
        }
    }

    @Post("forgot-password-restaurant")
    async forgotPasswordInRestaurant(@Body() params:ForgotPasswordDto){
        try {
            return await this.service.forgotPasswordInRestaurant();
        } catch (error) {
            throw Error(error)
        }
    }
}