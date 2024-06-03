import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from 'src/core/guard/auth.guard';

@Controller('address')
export class AddressController{
constructor(private readonly service:AddressService){}


@UseGuards(AuthGuard)
@Get("map-kit")
getApiKey(){
    return "14ed6c2b-adf0-4449-959b-62ca9708f445";
}

}