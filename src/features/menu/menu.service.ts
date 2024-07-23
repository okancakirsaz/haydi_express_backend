import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/base_service';
import { FirebaseColumns } from 'src/core/constants/firebase_columns';
import { DiscountDto } from 'src/core/dt_objects/menu/discount.dto';
import { MenuDto } from 'src/core/dt_objects/menu/menu.dto';
import { CommentDto } from 'src/core/dt_objects/public/comment.dto';
import { params } from 'firebase-functions/v1';

@Injectable()
export class MenuService extends BaseService {
  async createMenu(
    params: MenuDto,
    file: Express.Multer.File,
  ): Promise<MenuDto> {
    const fileUrl: string = await this.firebase.uploadFileToStorage(
      params.restaurantUid,
      'menu',
      params.menuId,
      file,
    );
    params.photoUrl = fileUrl;
    await this.firebase.setData(
      FirebaseColumns.RESTAURANT_MENUS,
      params.menuId,
      MenuDto.toJson(params),
    );
    return params;
  }

  async editMenu(
    params: MenuDto,
    file: Express.Multer.File | null,
  ): Promise<MenuDto> {
    if (file != null) {
      const fileUrl: string = await this.firebase.uploadFileToStorage(
        params.restaurantUid,
        'menu',
        params.menuId,
        file,
      );
      params.photoUrl = fileUrl;
    }
    await this.firebase.updateData(
      FirebaseColumns.RESTAURANT_MENUS,
      params.menuId,
      MenuDto.toJson(params),
    );
    return params;
  }

  async getRestaurantMenu(id: string): Promise<any[]> {
    return await this.firebase.getDataWithWhereQuery(
      FirebaseColumns.RESTAURANT_MENUS,
      'restaurantUid',
      '==',
      id,
    );
  }

  async addDiscount(params: DiscountDto): Promise<DiscountDto> {
    const column: string = FirebaseColumns.RESTAURANT_MENUS;
    const rawMenuData = await this.firebase.getDoc(column, params.menuId);
    const menuItem: MenuDto = MenuDto.fromJson(rawMenuData);
    menuItem.discountAmount = params.amount;
    (menuItem.discountFinishDate = params.expireDate),
      (menuItem.isOnDiscount = true);
    await this.firebase.updateData(
      column,
      params.menuId,
      MenuDto.toJson(menuItem),
    );
    return params;
  }

  async cancelCampaign(menuId: string): Promise<boolean> {
    try {
      const column: string = FirebaseColumns.RESTAURANT_MENUS;
      const menuElement: MenuDto = MenuDto.fromJson(
        await this.firebase.getDoc(column, menuId),
      );
      menuElement.discountAmount = null;
      menuElement.discountFinishDate = null;
      menuElement.isOnDiscount = false;
      await this.firebase.updateData(
        column,
        menuId,
        MenuDto.toJson(menuElement),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteMenu(params: MenuDto): Promise<boolean> {
    try {
      await this.firebase.deleteDoc(
        FirebaseColumns.BOOSTED_MENUS,
        params.menuId,
      );
      await this.firebase.deleteDoc(
        FirebaseColumns.RESTAURANT_MENUS,
        params.menuId,
      );
      await this.firebase.deleteFileFromStorage(
        params.restaurantUid,
        'menu',
        params.menuId,
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getSimilarFoods(tags: string[], menuId: string): Promise<MenuDto[]> {
    let finalRawData = [];
    for (let i: number = 0; i <= tags.length - 1; i++) {
      const response: Record<string, any>[] =
        (await this.firebase.getDataWithWhereQueryLimited(
          FirebaseColumns.RESTAURANT_MENUS,
          'tags',
          'array-contains',
          tags[i],
          2,
        )) ?? [];
      for (let j: number = 0; j <= response.length - 1; j++) {
        if (response[j] != null && response[j]['menuId'] != menuId) {
          finalRawData.push(response[j]);
        }
      }
    }
    return finalRawData.map((e) => MenuDto.fromJson(e));
  }

  async newComment(params:CommentDto): Promise<boolean | HttpException> {
    try {
      const checkIsUserCommittedThisMenuBefore: boolean =
        await this.checkIsUserCommittedThisMenuBefore(params);
      if (checkIsUserCommittedThisMenuBefore) {
        return new HttpException(
          'Bu menü için daha önce yorum yapmışsınız.',
          HttpStatus.CONFLICT,
        );
      }
      await this.firebase.setData(FirebaseColumns.COMMENTS,params.uid,CommentDto.toJson(params));
      await this.updateMenuData(params);
      return true;
    } catch (error) {  
      return new HttpException(
        'Bir sorun oluştu, tekrar deneyiniz.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async updateMenuData(params: CommentDto) {
        const column:string = FirebaseColumns.RESTAURANT_MENUS;
        const rawData= 
          await this.firebase.getDoc(column, params.menuId);
        //Doing null check because menu may be was deleted.
        if(rawData!=null){
        let menu:MenuDto = MenuDto.fromJson(rawData);
        menu.stats.comments.push(params);
        //like parameter come between 1-5
        menu.stats.likeRatio= this.calculateMenuPoint(menu,params.like)
        await this.firebase.updateData(
          column,
          params.menuId,
          MenuDto.toJson(menu),
        );
        }
  }

  private calculateMenuPoint(menu:MenuDto,like: number):number {
    const likeList:number[] = menu.stats.comments.map((e)=>e.like*20);
    likeList.push(like*20);
    const likeRatio:number = likeList.reduce((a,b)=>a+b);
    console.log(likeRatio);
    return likeRatio/likeList.length;
  }

  private async checkIsUserCommittedThisMenuBefore(
    params: CommentDto,
  ): Promise<boolean> {
    const check: any[] = await this.firebase.getDataWithWhereQuery(
      FirebaseColumns.COMMENTS,
      'customerId',
      '==',
      params.customerId,
    )??[];
    let checkIsUserCommittedThisMenuBefore: boolean = false;
    for (let i: number = 0; i <= check.length - 1; i++) {
      const element: CommentDto = CommentDto.fromJson(check[i]);
      if (element.menuId == params.menuId) {
        checkIsUserCommittedThisMenuBefore = true;
      }
    }
    return checkIsUserCommittedThisMenuBefore;
  }

 async isMenuAvailable(menuId:string):Promise<boolean>{
    const column:string = FirebaseColumns.RESTAURANT_MENUS;
    const rawData= 
      await this.firebase.getDoc(column,menuId);
    if(rawData!=null){
      return true;
    }
    else{
      return false;
    }
}
}
