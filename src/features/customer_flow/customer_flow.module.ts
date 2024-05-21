import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CustomerFlowService } from './customer_flow.service';
import { CustomerFlowController } from './customer_flow.controller';
@Module({
providers:[CustomerFlowService,AuthGuard],
controllers:[CustomerFlowController]
})
export class CustomerFlowModule{}