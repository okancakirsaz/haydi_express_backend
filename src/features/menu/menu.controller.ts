import { Body, Controller, Get, Header, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuDto } from "src/core/dt_objects/menu/menu.dto";
import { FileInterceptor } from "@nestjs/platform-express/multer";



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

    @Get('get-restaurant-menu/:id')
    async getRestaurantMenu(@Param("id") id:string){
        try {
            return await this.service.getRestaurantMenu(id);
        } catch (error) {
            throw Error(error);
        }
    }
}