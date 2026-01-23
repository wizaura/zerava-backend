import { Injectable } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { CreateBookingDto } from './booking.dto';
import { BookingStatus } from '@prisma/client';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class BookingService {
    constructor(
        private readonly repo: BookingRepository,
        private readonly mail: MailService,
    ) { }

    async createBooking(dto: CreateBookingDto) {
        const booking = await this.repo.createWithSlotLock(dto);

        await this.mail.sendBookingConfirmation({
            to: booking.email,
            name: booking.name,
            reference: booking.referenceCode as string,
            date: booking.createdAt.toDateString(),
            timeFrom: booking.timeFrom,
            timeTo: booking.timeTo,
            price: booking.price,
        });

        return booking;
    }

    /* ---------- USER ---------- */

    getUserBookings(userId: string) {
        return this.repo.findByUser(userId);
    }

    /* ---------- ADMIN ---------- */

    getAdminBookings(filters: {
        search?: string;
        status?: BookingStatus;
    }) {
        return this.repo.findForAdmin(filters);
    }
}
