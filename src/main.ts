import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as bodyParser from "body-parser";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = app.getHttpAdapter().getInstance();
  server.set("trust proxy", 1);

  app.use(
    "/payments/webhook",
    bodyParser.raw({ type: "application/json" })
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'https://zerava-frontend.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Client'],
  });
  app.use(cookieParser());

  app.use("/uploads", express.static("uploads"));


  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
