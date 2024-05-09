import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { AuthService } from "./auth.services";
import { RestaurantDto } from "src/core/dt_objects/user/restaurant.dto";
import { LogInDto } from "src/core/dt_objects/auth/log_in.dto";
import { ForgotPasswordDto } from "src/core/dt_objects/auth/forgot_password.dto";
import { ResetPasswordDto } from "src/core/dt_objects/auth/reset_password.dto";
import { MailVerificationRequestDto } from "src/core/dt_objects/auth/mail_verification_request.dto";
import { MailVerificationDto } from "src/core/dt_objects/auth/mail_verification.dto";
import { params } from "firebase-functions/v1";
import { CustomerDto } from "src/core/dt_objects/auth/customer.dto";
import { FirebaseColumns } from "src/core/constants/firebase_columns";


@Controller('auth')
export class AuthController{
    constructor(private readonly service:AuthService){}

    @Post('sign-up-restaurant')
    async signUpAsRestaurant(@Body() params:RestaurantDto):Promise<RestaurantDto|HttpException>{
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
    async forgotPasswordRestaurant(@Body() params:ForgotPasswordDto){
        try {
            return await this.service.forgotPassword(params,FirebaseColumns.RESTAURANTS);
        } catch (error) {
            throw Error(error)
        }
    }

    @Post("forgot-password-customer")
    async forgotPasswordCustomer(@Body() params:ForgotPasswordDto){
        try {
            return await this.service.forgotPassword(params,FirebaseColumns.CUSTOMERS);
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


    @Post("sign-up-customer")
    async signUpCustomer(@Body() params:CustomerDto):Promise<CustomerDto|HttpException>{
        try {
            return await this.service.signUpCustomer(params);
        } catch (error) {
            throw Error(error)
        }
    }
}