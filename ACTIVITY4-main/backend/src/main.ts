import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors();

  // Enable validation and transformation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Weather Proxy API')
    .setDescription('Build a proxy service that fetches weather from OpenWeatherMap and returns simpler results.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
  console.log('Swagger available at http://localhost:3000/api');
}

bootstrap();