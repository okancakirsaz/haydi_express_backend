import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuDto } from "src/core/dt_objects/menu/menu.dto";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { DiscountDto } from "src/core/dt_objects/menu/discount.dto";



@Controller('menu')
export class MenuController{
    constructor(private readonly service:MenuService){}

    @Post('create-menu')
    @UseInterceptors(FileInterceptor('file'))
    async createMenu(@Body() params,@UploadedFile() file:Express.Multer.File):Promise<MenuDto>{
        try {
            return await this.service.createMenu(MenuDto.fromJson(JSON.parse(params['json'])),file);
        } catch (error) {
            throw Error(error);
        }
    }

    @Get('get-restaurant-menu')
    async getRestaurantMenu(@Query("id") id:string){
        try {
            return await this.service.getRestaurantMenu(id);
        } catch (error) {
            throw Error(error);
        }
    }

    @Post('add-discount')
    async addDiscount(@Body() params:DiscountDto):Promise<DiscountDto>{
        try {
            return await this.service.addDiscount(params);
        } catch (error) {
            throw Error(error);
        }
    }

    @Get('cancel-campaign')
    async cancelCampaign(@Query("menuId") menuId:string):Promise<boolean>{
        try {
            return await this.service.cancelCampaign(menuId);
        } catch (error) {
            throw Error(error);
        }
    }
}