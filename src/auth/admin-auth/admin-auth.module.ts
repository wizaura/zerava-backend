// admin-auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminAuthController } from "./admin-auth.controller";
import { AdminAuthService } from "./admin-auth.service";
import { AdminJwtStrategy } from "./jwt/jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { MailModule } from "src/common/services/mail/mail.module";

@Module({
    imports: [JwtModule.register({}), MailModule],
    controllers: [AdminAuthController],
    providers: [AdminAuthService, AdminJwtStrategy, PrismaService],
})
export class AdminAuthModule { }
