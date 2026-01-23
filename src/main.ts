import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as bodyParser from "body-parser";
import { runRuntimeSeed } from './seed/runtime.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await runRuntimeSeed();

  app.use(
    "/payments/webhook",
    bodyParser.raw({ type: "application/json" })
  );

  app.enableCors({
    origin: ['http://localhost:3000','https://zerava-frontend.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Client'],
  });
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
