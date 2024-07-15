import { NestFactory } from '@nestjs/core';
import { FirebaseServices } from './core/services/firebase_services';
import { AppModule } from './app.module';
import { json } from 'express';
import { SwaggerSettings } from './core/constants/swagger_settings';
import { SwaggerModule } from '@nestjs/swagger';
import { LogDatabaseService } from './core/services/log_database_service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  FirebaseServices.instance.initApp();
  LogDatabaseService.instance.initApp();

  const swaggerSettings:SwaggerSettings = new SwaggerSettings(app);
  SwaggerModule.setup('api', app, swaggerSettings.document);

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
