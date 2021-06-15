import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import events from 'events';
import { AppLoggerService } from './app-logger.service';
import { AppModule } from './modules/app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, { logger: new AppLoggerService() });
  app.enableCors({ origin: ['http://localhost:5000'], methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true });
  await app.listen(3000);
}
events.defaultMaxListeners = Infinity;
bootstrap();
