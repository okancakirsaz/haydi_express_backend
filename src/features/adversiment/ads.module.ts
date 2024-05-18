import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
@Module({
providers:[AdsService,AuthGuard],
controllers:[AdsController]
})
export class AdsModule{}