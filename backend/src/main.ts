import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: allow specific frontend origin in production (Vercel URLs), or allow all if CORS_ORIGIN is '*'
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: true,
  });

  const port = process.env.PORT || parseInt(process.env.PORT as string, 10) || 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on port ${port}`);
}
bootstrap();
