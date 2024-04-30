import { NestFactory } from '@nestjs/core';
import { FirebaseServices } from './core/services/firebase_services';
import { AppModule } from './app.module';
import { json } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  FirebaseServices.instance.initApp();


  //TODO:Deactive on release
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  app.use(json({ limit: '10mb' }));
  await app.listen(3000);
}
bootstrap();
