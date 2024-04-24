import { Module } from '@nestjs/common';
import { FirebaseServices } from './core/services/firebase_services';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [FirebaseServices],
})
export class AppModule {}
