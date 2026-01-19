import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, "admin-jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => req?.cookies?.adminAccessToken || null,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: process.env.ADMIN_JWT_SECRET as string,
        });
    }

    async validate(payload: { sub: string }) {
        return { id: payload.sub, role: "admin" };
    }
}

