import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({ origin: '*' }); // allow all origins (public API)
  
  await app.listen(process.env.PORT || 3000, '0.0.0.0'); // bind to all interfaces
}
bootstrap();
