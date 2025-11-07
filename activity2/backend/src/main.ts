import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for your React app
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // frontend origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  await app.listen(3000);
  console.log('✅ Backend running on http://localhost:3000');
}
bootstrap();
