import { Module } from '@nestjs/common';
import { FirebaseServices } from './core/services/firebase_services';
import { AuthModule } from './features/auth/auth.module';
import { MenuModule } from './features/menu/menu.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobServiceModule } from './core/services/cronjob_services/cronjob_module';

@Module({
  imports: [AuthModule,MenuModule,ScheduleModule.forRoot(),CronjobServiceModule],
  controllers: [],
  providers: [FirebaseServices],
})
export class AppModule {}
