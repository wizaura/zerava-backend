import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceAreaRepository {
    constructor(private readonly prisma: PrismaService) { }

    /* -------- PUBLIC -------- */

    findByPostcode(postcode: string) {
        return this.prisma.serviceArea.findMany({
            where: {
                postcode,
                isActive: true,
            },
            select: {
                weekday: true,
            },
        });
    }

    /* -------- ADMIN -------- */

    findAll() {
        return this.prisma.serviceArea.findMany({
            orderBy: [{ postcode: 'asc' }, { weekday: 'asc' }],
        });
    }

    create(postcode: string, weekday: number) {
        return this.prisma.serviceArea.create({
            data: {
                postcode,
                weekday,
                isActive: true,
            },
        });
    }

    delete(id: string) {
        return this.prisma.serviceArea.delete({
            where: { id },
        });
    }
}
