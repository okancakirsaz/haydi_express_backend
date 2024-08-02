import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CourierService } from './courier.service';
import { CourierController } from './courier.controller';
@Module({
providers:[CourierService,AuthGuard],
controllers:[CourierController]
})
export class CourierModule{}