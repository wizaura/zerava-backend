import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "./jwt/jwt.guard";
import { AdminVerifyOtpDto } from "./dto/admin-verify-otp.dto";
import { AdminRequestOtpDto } from "./dto/admin-request-otp.dto";
import { AdminAuthService } from "./admin-auth.service";
import type { Response } from "express";

@Controller("admin/auth")
export class AdminAuthController {
    constructor(private readonly auth: AdminAuthService) { }

    @Post("request-otp")
    requestOtp(@Body() dto: AdminRequestOtpDto) {
        return this.auth.requestOtp(dto.email);
    }

    @Post("verify-otp")
    async verifyOtp(@Body() dto: AdminVerifyOtpDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.auth.verifyOtp(dto.email, dto.otp);

        res.cookie("adminRefreshToken", result.refreshToken, { httpOnly: true, sameSite: "lax", secure: false, maxAge:  60 * 1000 });
        res.cookie("adminAccessToken", result.accessToken, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 15 * 60 * 1000 });

        return { admin: result.admin, token: result.accessToken };
    }

    @Post("refresh")
    async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
        const token = req.cookies?.adminRefreshToken;
        const result = await this.auth.refreshAccessToken(token);

        res.cookie("adminAccessToken", result.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        return result;
    }

    @Get("me")
    @UseGuards(AdminJwtAuthGuard)
    async me(@Req() req) {
        const admin = await this.auth.getAdminById(req.user.id);
        return { admin };
    }

}
