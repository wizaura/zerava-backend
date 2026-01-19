import { Injectable } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingService {
    constructor(private readonly repo: BookingRepository) { }

    createBooking(dto: CreateBookingDto) {
        return this.repo.createWithSlotLock(dto);
    }
}

