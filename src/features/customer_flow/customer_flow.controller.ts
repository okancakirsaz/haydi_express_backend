import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomerFlowService } from './customer_flow.service';
import { AuthGuard } from 'src/core/guard/auth.guard';

@Controller('flow')
export class CustomerFlowController{
constructor(private readonly service:CustomerFlowService){}

@Get("adverted-menu")
async getAdvertedMenus(@Query("category") category:string){
    try {
      return this.service.getAdvertedMenus(category);  
    } catch (error) {
      throw Error();
    }
}

@UseGuards(AuthGuard)
@Get("more-adverted-menu")
async getMoreAdvertedMenus(@Query("expire") expire:string,@Query("category") category:string){
    try {
      return this.service.getMoreAdvertedMenus(expire,category);  
    } catch (error) {
      throw Error();
    }
}

@UseGuards(AuthGuard)
@Get("discover")
async discover(){
    try {
      return this.service.discover();  
    } catch (error) {
      throw Error();
    }
}


@UseGuards(AuthGuard)
@Get("more-discover")
async moreDiscover(@Query("likeRatio") likeRatio:string){
    try {
      return this.service.moreDiscover(likeRatio);  
    } catch (error) {
      throw Error();
    }
}
}