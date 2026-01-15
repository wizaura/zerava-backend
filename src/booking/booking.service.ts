import { Injectable } from '@nestjs/common';
import { BookingRepository } from './booking.repository';

@Injectable()
export class BookingService {
    constructor(private readonly repo: BookingRepository) { }

    createBooking(payload: any) {
        const { timeSlotId, ...bookingData } = payload;

        return this.repo.createWithSlotLock({
            timeSlotId,
            bookingData,
        });
    }
}
