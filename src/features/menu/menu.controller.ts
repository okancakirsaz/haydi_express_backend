import { Body, Controller, Get, HttpException, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuDto } from "src/core/dt_objects/menu/menu.dto";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { DiscountDto } from "src/core/dt_objects/menu/discount.dto";
import { AuthGuard } from "src/core/guard/auth.guard";
import { CommentDto } from "src/core/dt_objects/public/comment.dto";

@Controller('menu')
export class MenuController{
    constructor(private readonly service:MenuService){}


    @UseGuards(AuthGuard)
    @Post('create-menu')
    @UseInterceptors(FileInterceptor('file'))
    async createMenu(@Body() params,@UploadedFile() file:Express.Multer.File):Promise<MenuDto>{
        try {
            return await this.service.createMenu(MenuDto.fromJson(JSON.parse(params['json'])),file);
        } catch (error) {
            throw Error(error);
        }
    }

    @UseGuards(AuthGuard)
    @Post('edit-menu')
    @UseInterceptors(FileInterceptor('file'))
    async editMenu(@Body() params,@UploadedFile() file:Express.Multer.File|null):Promise<MenuDto>{
        try {
            return await this.service.editMenu(MenuDto.fromJson(JSON.parse(params['json'])),file);
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

    @UseGuards(AuthGuard)
    @Post('add-discount')
    async addDiscount(@Body() params:DiscountDto):Promise<DiscountDto>{
        try {
            return await this.service.addDiscount(params);
        } catch (error) {
            throw Error(error);
        }
    }

    @UseGuards(AuthGuard)
    @Get('cancel-campaign')
    async cancelCampaign(@Query("menuId") menuId:string):Promise<boolean>{
        try {
            return await this.service.cancelCampaign(menuId);
        } catch (error) {
            throw Error(error);
        }
    }

    @UseGuards(AuthGuard)
    @Post('delete-menu')
    async deleteMenu(@Body() params:MenuDto):Promise<boolean>{
        try {
            return await this.service.deleteMenu(params);
        } catch (error) {
            throw Error(error);
        }
    }

    @UseGuards(AuthGuard)
    @Get('get-similar-foods')
    async getSimilarFoods(@Query("tags") tags:string,@Query("menuId") menuId:string):Promise<MenuDto[]>{
        try {
           
            return await this.service.getSimilarFoods(JSON.parse(tags),menuId);
        } catch (error) {
            throw Error(error);
        }
    }

    @UseGuards(AuthGuard)
    @Post('new-comment')
    async newComment(@Body() params:CommentDto):Promise<boolean|HttpException>{
        try {
            return await this.service.newComment(params);
        } catch (error) {
            throw Error(error);
        }
    }

    @UseGuards(AuthGuard)
    @Get('is-menu-available')
    async isMenuAvailable(@Query("menuId") menuId:string):Promise<boolean>{
        try {
            return await this.service.isMenuAvailable(menuId);
        } catch (error) {
            throw Error(error);
        }
    }
}