import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for frontend
  app.enableCors();
  // Enable transformation but avoid aggressive whitelist stripping
  // (whitelist removes properties unless class-validator decorators are present)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Bookshelf API')
    .setDescription('CRUD for books, authors, categories')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Allow requests from frontend (vite) during development
  app.enableCors();

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
  console.log('Swagger available at http://localhost:3000/api');
}

bootstrap();
