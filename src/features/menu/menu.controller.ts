import { Body, Controller, HttpException, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
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

}