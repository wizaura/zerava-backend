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
            sameSite: 'lax',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
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
            sameSite: 'lax',
            secure: false,
            maxAge: 15 * 60 * 1000,
        });

        return result;
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req) {
        const user = await this.auth.getUserById(req.user.id);
        return { user };
    }

}
