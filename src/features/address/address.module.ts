import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
@Module({
providers:[AddressService,AuthGuard],
controllers:[AddressController]
})
export class AddressModule{}