import { Injectable } from '@nestjs/common';
import { BookingRepository } from './booking.repository';

@Injectable()
export class BookingService {
    constructor(private readonly repo: BookingRepository) { }

    createBooking(payload: any) {
        const { serviceSlotId, ...bookingData } = payload;

        return this.repo.createWithSlotLock({
            serviceSlotId,
            bookingData,
        });
    }
}
