import { Injectable } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { CreateBookingDto } from './booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService {
    constructor(private readonly repo: BookingRepository) { }

    createBooking(dto: CreateBookingDto) {
        return this.repo.createWithSlotLock(dto);
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
