import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderGateway } from './order_gateway';
@Module({
providers:[OrderService,AuthGuard,OrderGateway],
controllers:[OrderController]
})
export class OrderModule{}