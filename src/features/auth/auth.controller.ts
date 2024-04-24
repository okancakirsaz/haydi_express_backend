import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.services";
import { UserDto } from "src/core/dt_objects/user/user.dto";
import { LogInDto } from "src/core/dt_objects/auth/log_in.dto";
import { ForgotPasswordDto } from "src/core/dt_objects/auth/forgot_password.dto";

//TODO: Import dto's.
@Controller('auth')
export class AuthController{
    constructor(private readonly service:AuthService){}

    @Post('sign-up')
    async signUp(@Body() params:UserDto):Promise<UserDto>{
    try {
    return await this.service.signUp(params);
    } catch (error) {
    throw Error(error);
    }
    }
    @Post("log-in")
    async logIn(@Body() params:LogInDto){
        try {
            return await this.service.logIn(params);
        } catch (error) {
            throw Error(error)
        }
    }

    @Post("forgot-password")
    async forgotPassword(@Body() params:ForgotPasswordDto){
        try {
            return await this.service.forgotPassword();
        } catch (error) {
            throw Error(error)
        }
    }
}