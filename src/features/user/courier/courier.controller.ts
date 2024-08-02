import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourierService } from './courier.service';

@Controller('courier')
export class CourierController{
constructor(private readonly service:CourierService){}
}