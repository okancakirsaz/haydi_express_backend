import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./service/auth.services";
import { CustomerAuthService } from "./service/customer_auth.service";
import { RestaurantAuthService } from "./service/restaurant_auth.service";
import { HubAuthService } from "./service/hub_auth.service";

@Module({
    providers:[AuthService,CustomerAuthService,RestaurantAuthService,HubAuthService],
    controllers:[AuthController]
})
export class AuthModule{}