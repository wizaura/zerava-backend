import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt/jwt.guard";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { RequestOtpDto } from "./dto/request-otp.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Post('request-otp')
    requestOtp(@Body() dto: RequestOtpDto) {
        return this.auth.requestOtp(dto.email);
    }


    @Post('verify-otp')
    async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.auth.verifyOtp(dto.email, dto.otp);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            maxAge: 15 * 60 * 1000,
        });

        return { user: result.user };
    }

    @Post('refresh')
    async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
        const token = req.cookies?.refreshToken;
        if (!token) throw new UnauthorizedException();

        const result = await this.auth.refreshAccessToken(token);

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            maxAge: 15 * 60 * 1000,
        });

        return result;
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req) {
        return {
            user: {
                id: req.user.id,
            },
        };
    }

    @Post("logout")
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        return { success: true };
    }


}
