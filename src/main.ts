import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';
import { MyLoggerService } from './my-logger/my-logger.service';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.useLogger(app.get(MyLoggerService));
  const config = new DocumentBuilder()
    .setTitle('Auth-log')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  logger.log(`Server start on port: ${port}`);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
