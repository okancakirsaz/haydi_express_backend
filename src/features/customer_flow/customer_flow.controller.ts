import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomerFlowService } from './customer_flow.service';
import { AuthGuard } from 'src/core/guard/auth.guard';

@Controller('flow')
export class CustomerFlowController{
constructor(private readonly service:CustomerFlowService){}

@Get("haydi-firsatlar")
async getHaydiFirsatlar(){
    try {
      return this.service.getHaydiFirsatlar();  
    } catch (error) {
        throw Error();
    }
}

@UseGuards(AuthGuard)
@Get("more-haydi-firsatlar")
async getMoreHaydiFirsatlar(@Query("expire") expire:string){
    try {
      return this.service.getMoreHaydiFirsatlar(expire);  
    } catch (error) {
        throw Error();
    }
}
}