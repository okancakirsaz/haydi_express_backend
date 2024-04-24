import { NestFactory } from '@nestjs/core';
import { FirebaseServices } from './core/services/firebase_services';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  FirebaseServices.instance.initApp();
  await app.listen(3000);
}
bootstrap();
