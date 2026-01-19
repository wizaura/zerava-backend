import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { mailer } from "src/common/services/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import bcrypt from "bcryptjs";

// admin-auth.service.ts
@Injectable()
export class AdminAuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    private generateAccessToken(id: string) {
        return this.jwt.sign({ sub: id }, {
            expiresIn: "10m",
            secret: process.env.ADMIN_JWT_SECRET,
        });
    }

    private generateRefreshToken(id: string) {
        return this.jwt.sign({ sub: id }, {
            expiresIn: "1d",
            secret: process.env.ADMIN_JWT_REFRESH_SECRET,
        });
    }

    async requestOtp(email: string) {
        const admin = await this.prisma.admin.findUnique({ where: { email } });
        if (!admin) throw new UnauthorizedException("Not allowed");

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hash = await bcrypt.hash(otp, 10);

        await this.prisma.otp.create({
            data: {
                email,
                codeHash: hash,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
        });

        await mailer.sendMail({
            to: email,
            subject: "Admin Login OTP",
            html: `<b>${otp}</b> (Valid 5 minutes)`,
        });

        return { message: "OTP sent" };
    }

    async verifyOtp(email: string, otp: string) {
        const record = await this.prisma.otp.findFirst({
            where: { email, used: false, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: "desc" },
        });

        if (!record || !(await bcrypt.compare(otp, record.codeHash))) {
            throw new UnauthorizedException("Invalid OTP");
        }

        await this.prisma.otp.update({
            where: { id: record.id },
            data: { used: true },
        });

        let admin = await this.prisma.admin.findUnique({ where: { email } });

        // if(!admin){
        //     throw new UnauthorizedException("Not found");
        // }

        if (!admin) {
            admin = await this.prisma.admin.create({ data: { email } });
        }

        const accessToken = this.generateAccessToken(admin.id);
        const refreshToken = this.generateRefreshToken(admin.id);

        return { accessToken, refreshToken, admin: { id: admin.id, email: admin.email } };
    }

    async refreshAccessToken(token: string) {
        const payload = this.jwt.verify(token, { secret: process.env.ADMIN_JWT_REFRESH_SECRET });
        return { accessToken: this.generateAccessToken(payload.sub) };
    }

    async getAdminById(id: string) {
        return this.prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
            },
        });
    }

}
