import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
@Module({
providers:[RestaurantService,AuthGuard],
controllers:[RestaurantController]
})
export class RestaurantModule{}