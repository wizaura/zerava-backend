import { Body, Controller, Post } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
    constructor(private readonly service: AvailabilityService) { }

    @Post('check')
    check(
        @Body()
        body: {
            postcode: string;
            date: string;
        },
    ) {
        console.log(body, 'body')
        return this.service.checkAvailability(
            body.postcode,
            body.date,
        );
    }
}
