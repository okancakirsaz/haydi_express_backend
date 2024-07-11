import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
@Module({
providers:[OrderService,AuthGuard],
controllers:[OrderController]
})
export class OrderModule{}