import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    getProfile(id: string) {
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

    updateProfile(id: string, data: any) {
        return this.prisma.user.update({
            where: { id },
            data: {
                fullName: data.fullName,
                phone: data.phone,
                address: data.address,
                postcode: data.postcode,
                vehicleSize: data.vehicleSize,
            },
        });
    }

     /* ---------- ADMIN ---------- */
    getAllForAdmin() {
        return this.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
            },
        });
    }
}
