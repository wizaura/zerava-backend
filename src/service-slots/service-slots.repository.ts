import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceSlotsRepository {
    constructor(private readonly prisma: PrismaService) { }

    /* -------- ADMIN -------- */

    findAll() {
        return this.prisma.serviceSlot.findMany({
            orderBy: [{ date: 'asc' }],
            where: {
                operator: {
                    isActive: true,
                },
            },
            include: {
                operator: true,
                _count: {
                    select: { bookings: true },
                },
            },
        });
    }

    create(data: {
        operatorId: string;
        date: Date;
        timeFrom: string;
        timeTo: string;
        maxBookings: number;
        zonePrefix?: string;
    }) {
        console.log("operatorId received:", data.operatorId);

        return this.prisma.serviceSlot.create({
            data: {
                operatorId: data.operatorId,
                date: data.date,
                timeFrom: data.timeFrom,
                timeTo: data.timeTo,
                maxBookings: data.maxBookings,
                zonePrefix: data.zonePrefix,
                status: 'ACTIVE',
            },
        });
    }

    delete(id: string) {
        return this.prisma.serviceSlot.delete({
            where: { id },
        });
    }

    /* -------- AVAILABILITY -------- */

    findAvailable(date: Date, prefix: string) {
        return this.prisma.serviceSlot.findMany({
            where: {
                date,
                status: 'ACTIVE',
                OR: [
                    { zonePrefix: prefix },
                    { zonePrefix: null },
                ],
            },
            include: {
                operator: true,
                bookings: {
                    select: {
                        timeFrom: true,
                        timeTo: true,
                    }
                },
                _count: {
                    select: { bookings: true },
                },
            },
            orderBy: {
                timeFrom: 'asc',
            },
        });
    }
}
