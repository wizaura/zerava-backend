import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as bodyParser from "body-parser";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    "/payments/webhook",
    bodyParser.raw({ type: "application/json" })
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowed = [
        "http://localhost:3000",
        "https://zerava-frontend.vercel.app",
      ];

      if (!origin) return callback(null, true);

      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  });

  app.use(cookieParser());

  app.use("/uploads", express.static("uploads"));


  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
