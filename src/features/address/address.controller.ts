import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from 'src/core/guard/auth.guard';

@Controller('address')
export class AddressController{
constructor(private readonly service:AddressService){}

}