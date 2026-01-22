import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { AdminJwtAuthGuard } from 'src/auth/admin-auth/jwt/jwt.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CreateBookingDto } from './booking.dto';
import { BookingStatus } from '@prisma/client';

@Controller('bookings')
export class BookingController {
    constructor(private readonly service: BookingService) { }

    /* ---------- USER ---------- */

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMyBookings(@Req() req: any) {
        return this.service.getUserBookings(req.user.id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Req() req, @Body() dto: CreateBookingDto) {
        return this.service.createBooking({
            ...dto,
            userId: req.user.id,
        });
    }


    /* ---------- ADMIN ---------- */

    @UseGuards(AdminJwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin')
    getAllBookings(
        @Query('search') search?: string,
        @Query('status') status?: BookingStatus,
    ) {
        return this.service.getAdminBookings({ search, status });
    }
}
