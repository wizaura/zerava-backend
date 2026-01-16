import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createWithSlotLock(data: {
        serviceSlotId: string;
        bookingData: any;
    }) {
        return this.prisma.$transaction(async (tx) => {
            const slot = await tx.serviceSlot.findUnique({
                where: { id: data.serviceSlotId },
                include: {
                    bookings: true,
                },
            });

            if (!slot) {
                throw new BadRequestException('Slot not found');
            }

            if (slot.status !== 'ACTIVE') {
                throw new BadRequestException('Slot inactive');
            }

            if (slot.bookings.length >= slot.maxBookings) {
                throw new BadRequestException('Slot fully booked');
            }

            return tx.booking.create({
                data: {
                    serviceSlotId: slot.id,
                    ...data.bookingData,
                    status: 'PENDING_PAYMENT',
                },
            });
        });
    }
}
