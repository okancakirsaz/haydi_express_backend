import { Body, Controller, Get, HttpException, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { AddressDto } from 'src/core/dt_objects/user/address/address.dto';

@Controller('address')
export class AddressController{
constructor(private readonly service:AddressService){}


@UseGuards(AuthGuard)
@Post("create")
async createAddress(@Body() params:AddressDto):Promise<boolean>{
    try {
        return await this.service.createAddress(params);
        } catch (error) {
        throw Error();
        }
}

@UseGuards(AuthGuard)
@Get("get-user-addresses")
async getUserAddresses(@Query("userId") userId:string):Promise<AddressDto[]>{
    try {
        return await this.service.getUserAddresses(userId);
        } catch (error) {
        throw Error();
        }
}

@UseGuards(AuthGuard)
@Get("delete-address")
async deleteAddress(@Query("id") id:string):Promise<boolean>{
    try {
        return await this.service.deleteAddress(id);
        } catch (error) {
        throw Error();
        }
}
}