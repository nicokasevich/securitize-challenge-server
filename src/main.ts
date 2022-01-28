import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appenv from './config/appenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(appenv.APP_PORT);
}
bootstrap();
