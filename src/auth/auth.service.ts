import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import bcrypt from 'bcryptjs';
import { mailer } from "src/common/services/mail.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    private generateAccessToken(userId: string) {
        return this.jwt.sign(
            { sub: userId },
            { expiresIn: '15m', secret: process.env.JWT_SECRET },
        );
    }

    private generateRefreshToken(userId: string) {
        return this.jwt.sign(
            { sub: userId },
            { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
        );
    }

    async requestOtp(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const codeHash = await bcrypt.hash(otp, 10);

        await this.prisma.otp.create({
            data: {
                email,
                codeHash,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
            },
        });

        // TEMP (replace with MailService)
        console.log(`🔐 OTP for ${email}: ${otp}`);

        await mailer.sendMail({
            from: `"Zerava" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Your Login OTP",
            html: `<h2>Your OTP</h2><p><b>${otp}</b></p><p>Valid for 5 minutes.</p>`,
        });


        return {
            message: 'OTP sent successfully',
        };
    }

    async verifyOtp(email: string, otp: string) {
        const record = await this.prisma.otp.findFirst({
            where: { email, used: false, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        });

        if (!record || !(await bcrypt.compare(otp, record.codeHash))) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        await this.prisma.otp.update({
            where: { id: record.id },
            data: { used: true },
        });

        let user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await this.prisma.user.create({ data: { email } });
        }

        const accessToken = this.generateAccessToken(user.id);
        const refreshToken = this.generateRefreshToken(user.id);

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email },
        };
    }

    async refreshAccessToken(token: string) {
        try {
            const payload = this.jwt.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            return {
                accessToken: this.generateAccessToken(payload.sub),
            };
        } catch {
            throw new UnauthorizedException();
        }
    }

    async getUserById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                address: true,
                postcode: true,
                vehicleSize: true,
                createdAt: true,
            },
        });
    }

}
