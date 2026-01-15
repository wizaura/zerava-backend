import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SlotsRepository {
    constructor(private readonly prisma: PrismaService) { }

    /* ---------------- CREATE ---------------- */

    create(data: Prisma.TimeSlotCreateInput) {
        return this.prisma.timeSlot.create({
            data,
        });
    }

    /* ---------------- FIND ---------------- */

    findById(id: string) {
        return this.prisma.timeSlot.findUnique({
            where: { id },
            include: {
                bookings: true,
            },
        });
    }

    findByDate(date: Date) {
        return this.prisma.timeSlot.findMany({
            where: {
                date,
            },
            include: {
                bookings: true,
            },
            orderBy: {
                time: 'asc',
            },
        });
    }

    /* ---------------- UPDATE ---------------- */

    update(id: string, data: Prisma.TimeSlotUpdateInput) {
        return this.prisma.timeSlot.update({
            where: { id },
            data,
        });
    }
}
