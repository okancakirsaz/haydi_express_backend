import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
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
        return this.service.createAddress(params);
        } catch (error) {
        throw Error();
        }
}
}