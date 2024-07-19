import { Module } from '@nestjs/common';
import { FirebaseServices } from './core/services/firebase_services';
import { AuthModule } from './features/auth/auth.module';
import { MenuModule } from './features/menu/menu.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobServiceModule } from './core/services/cronjob_services/cronjob_module';
import { JwtConstants } from './core/constants/jwt_constant';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AdsModule } from './features/adversiment/ads.module';
import { CustomerFlowModule } from './features/customer_flow/customer_flow.module';
import { SearchModule } from './features/search/search.module';
import { AddressModule } from './features/address/address.module';
import { OrderModule } from './features/order/order.module';
import { CustomerModule } from './features/user/customer/customer.module';

@Module({
  imports: [AuthModule,MenuModule,AdsModule,CustomerFlowModule,SearchModule,OrderModule,CustomerModule,
    AddressModule,
    ScheduleModule.forRoot(),CronjobServiceModule,
    //For bearer token authentication
    new JwtConstants().jwtModule,
  //For rate limit
  ThrottlerModule.forRoot([{
    ttl: 60000,
    limit: 30,
  }]), 
],
  controllers: [],
  providers: [FirebaseServices,{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }
  ],
})
export class AppModule {}
