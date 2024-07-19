import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
@Module({
providers:[CustomerService,AuthGuard],
controllers:[CustomerController]
})
export class CustomerModule{}