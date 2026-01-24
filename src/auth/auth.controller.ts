import {
    Body,
    Controller,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import type { Response, Request, CookieOptions } from "express";
import { AuthService } from "./auth.service";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { RequestOtpDto } from "./dto/request-otp.dto";

const isProd = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax" as const,
    path: "/",
    ...(isProd && { domain: ".onrender.com" }),
};

@Controller("auth")
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Post("request-otp")
    requestOtp(@Body() dto: RequestOtpDto) {
        return this.auth.requestOtp(dto.email);
    }

    @Post("verify-otp")
    async verifyOtp(
        @Body() dto: VerifyOtpDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken, user } =
            await this.auth.verifyOtp(dto.email, dto.otp);

        res.cookie("accessToken", accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { user };
    }

    @Post("refresh")
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        const { accessToken } =
            await this.auth.refreshAccessToken(refreshToken);

        res.cookie("accessToken", accessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 15 * 60 * 1000,
        });

        return { success: true };
    }

    @Post("logout")
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("accessToken", COOKIE_OPTIONS);
        res.clearCookie("refreshToken", COOKIE_OPTIONS);

        return { success: true };
    }
}
