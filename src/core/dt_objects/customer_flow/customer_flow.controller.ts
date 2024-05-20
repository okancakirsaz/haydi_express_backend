import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomerFlowService } from './customer_flow.service';

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
}