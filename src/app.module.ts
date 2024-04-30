import { Module } from '@nestjs/common';
import { FirebaseServices } from './core/services/firebase_services';
import { AuthModule } from './features/auth/auth.module';
import { MenuModule } from './features/menu/menu.module';

@Module({
  imports: [AuthModule,MenuModule],
  controllers: [],
  providers: [FirebaseServices],
})
export class AppModule {}
