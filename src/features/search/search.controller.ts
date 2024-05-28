import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { SuggestionDto } from 'src/core/dt_objects/search/suggestion.dto';

@Controller('search')
export class SearchController{
constructor(private readonly service:SearchService){}

  @UseGuards(AuthGuard)
  @Get("get-search-ads")
  async getSearchAds():Promise<SuggestionDto[]>{
    try {
        return await this.service.getSearchAds();
        } catch (error) {
        throw Error();
        }
  }  
}