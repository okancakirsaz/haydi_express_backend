import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.services";
import { RestaurantDto } from "src/core/dt_objects/user/restaurant.dto";
import { LogInDto } from "src/core/dt_objects/auth/log_in.dto";
import { ForgotPasswordDto } from "src/core/dt_objects/auth/forgot_password.dto";
import { ResetPasswordDto } from "src/core/dt_objects/auth/reset_password.dto";
import { MailVerificationRequestDto } from "src/core/dt_objects/auth/mail_verification_request.dto";
import { MailVerificationDto } from "src/core/dt_objects/auth/mail_verification.dto";

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

    @Post("forgot-password")
    async forgotPassword(@Body() params:ForgotPasswordDto){
        try {
            return await this.service.forgotPassword(params);
        } catch (error) {
            throw Error(error)
        }
    }


    @Post("reset-password")
    async resetPassword(@Body() params:ResetPasswordDto){
        try {
            return await this.service.resetPassword(params);
        } catch (error) {
            throw Error(error)
        }
    }

    @Post("mail-verification-request")
    async mailVerificationRequest(@Body() params:MailVerificationRequestDto){
        try {
            return await this.service.mailVerificationRequest(params);
        } catch (error) {
            throw Error(error)
        }
    }

    @Post("mail-verification")
    async mailVerification(@Body() params:MailVerificationDto){
        try {
            return await this.service.mailVerification(params);
        } catch (error) {
            throw Error(error)
        }
    }
}