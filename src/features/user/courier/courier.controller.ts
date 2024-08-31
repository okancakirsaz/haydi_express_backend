import { Body, Controller, Delete, Get, HttpException, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourierService } from './courier.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CourierDto } from 'src/core/dt_objects/user/courier.dto';
import { CourierOptionsDto } from 'src/features/options/courier_options.dto';

@Controller('courier')
export class CourierController{
constructor(private readonly service:CourierService){}

@UseGuards(AuthGuard)
@Get('couriers')
async getCouriers():Promise<CourierDto[]>{
try {
return await this.service.getCouriers();
}
catch (error) {
throw Error(error);
}
}

@UseGuards(AuthGuard)
@Get('get-courier-options')
async getCourierOptions():Promise<CourierOptionsDto>{
try {
return await this.service.getCourierOptions();
}
catch (error) {
throw Error(error);
}
}


@UseGuards(AuthGuard)
@Post('set-courier-options')
async setCourierOptions(@Body() params:CourierOptionsDto):Promise<boolean>{
try {
return await this.service.setCourierOptions(params);
}
catch (error) {
throw Error(error);
}
}


@UseGuards(AuthGuard)
@Post('set-courier')
async setCourier(@Body() params:CourierDto):Promise<boolean>{
try {
return await this.service.setCourier(params);
}
catch (error) {
throw Error(error);
}
}


@UseGuards(AuthGuard)
@Patch('update-courier-work-state')
async updateCourierWorkState(@Body() params:CourierDto):Promise<boolean>{
try {
return await this.service.updateCourierWorkState(params);
}
catch (error) {
throw Error(error);
}
}

@UseGuards(AuthGuard)
@Delete('delete-courier')
async deleteCourier(@Query("courierId") courierId:string):Promise<boolean>{
try {
return await this.service.deleteCourier(courierId);
}
catch (error) {
throw Error(error);
}
}

@UseGuards(AuthGuard)
@Get('get-courier')
async getCourier(@Query("courierId") courierId:string):Promise<CourierDto>{
try {
return await this.service.getCourier(courierId);
}
catch (error) {
throw Error(error);
}
}

}