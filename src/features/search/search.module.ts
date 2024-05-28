import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
@Module({
providers:[SearchService,AuthGuard],
controllers:[SearchController]
})
export class SearchModule{}