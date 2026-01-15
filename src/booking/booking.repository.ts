import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createWithSlotLock(data: {
        timeSlotId: string;
        bookingData: any;
    }) {
        return this.prisma.$transaction(async (tx) => {
            const slot = await tx.timeSlot.findUnique({
                where: { id: data.timeSlotId },
                include: { bookings: true },
            });

            if (!slot) throw new BadRequestException('Slot not found');
            if (!slot.isActive)
                throw new BadRequestException('Slot blocked');
            if (slot.bookings.length >= slot.capacity)
                throw new BadRequestException('Slot fully booked');

            return tx.booking.create({
                data: {
                    timeSlotId: data.timeSlotId,
                    ...data.bookingData,
                    status: 'PENDING_PAYMENT',
                },
            });
        });
    }
}
