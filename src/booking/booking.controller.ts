import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
    constructor(private readonly service: BookingService) { }

    @Post()
    create(@Body() body: any) {
        console.log(body, 'Body')
        return this.service.createBooking(body);
    }
}
