import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
  });

  const port = 3000;

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Weather Proxy API')
    .setDescription('Fetches weather from OpenWeatherMap')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  console.log('\n🚀 Backend running on http://localhost:' + port);
  console.log('📄 Swagger docs available at http://localhost:' + port + '/api\n');
  console.log('🌐 Frontend (Vite/Static) available at http://localhost:5173\n');
}

bootstrap();