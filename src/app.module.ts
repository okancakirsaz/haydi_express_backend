import { Module } from '@nestjs/common';
import { FirebaseServices } from './core/services/firebase_services';
import { AuthModule } from './features/auth/auth.module';
import { MenuModule } from './features/menu/menu.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobServiceModule } from './core/services/cronjob_services/cronjob_module';
import { JwtConstants } from './core/constants/jwt_constant';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AdsModule } from './features/adversiment/ads.module';
import { CustomerFlowModule } from './core/dt_objects/customer_flow/customer_flow.module';

@Module({
  imports: [AuthModule,MenuModule,AdsModule,CustomerFlowModule, ScheduleModule.forRoot(),CronjobServiceModule,
    //For bearer token authentication
    //TODO: *REVIEW* get from jwt_constants file this function
    JwtModule.register({
    global: true,
    secret: new JwtConstants().secret,
    //NOTE: You can set access token expire date
  }),
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
