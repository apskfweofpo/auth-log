import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  Logger.log(`Server start on port: ${port}`);
  Logger.log(`${JSON.stringify(configService.get('POSTGRES_USER'))}`);
  await app.listen(port);
}
bootstrap();
