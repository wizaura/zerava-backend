import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    // --------------------
    // REQUEST OTP
    // --------------------
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

        return {
            message: 'OTP sent successfully',
        };
    }

    // --------------------
    // VERIFY OTP
    // --------------------
    async verifyOtp(email: string, otp: string) {
        const record = await this.prisma.otp.findFirst({
            where: {
                email,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!record) {
            throw new UnauthorizedException('OTP expired or invalid');
        }

        const isValid = await bcrypt.compare(otp, record.codeHash);
        if (!isValid) {
            throw new UnauthorizedException('Invalid OTP');
        }

        // mark OTP as used
        await this.prisma.otp.update({
            where: { id: record.id },
            data: { used: true },
        });

        // issue JWT
        const token = this.jwt.sign({
            sub: email,
            role: 'admin', // later you can detect admin/user
        });

        return {
            accessToken: token,
        };
    }
}
