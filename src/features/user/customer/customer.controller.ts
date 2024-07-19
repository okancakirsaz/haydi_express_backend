import { Body, Controller, Delete, Get, HttpException, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from 'src/core/guard/auth.guard';

@Controller('customer')
export class CustomerController{
constructor(private readonly service:CustomerService){
}
@UseGuards(AuthGuard)
@Delete('delete-account')
async deleteAccount(@Query("customerId") customerId:string,):Promise<boolean|HttpException>{
    try {
        return await this.service.deleteAccount(customerId);
    } catch (error) {
        throw Error(error);
    }
}

@UseGuards(AuthGuard)
@Get('change')
async change(@Query("customerId") customerId:string,@Query("changedValue") changedValue:string,@Query("newValue") newValue:string):Promise<boolean|HttpException>{
    try {
        return await this.service.change(customerId,changedValue,newValue);
    } catch (error) {
        throw Error(error);
    }
}
}