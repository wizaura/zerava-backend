import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ServiceSlotsService } from './service-slots.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller()
export class ServiceSlotsController {
    constructor(private readonly service: ServiceSlotsService) { }

    /* ---------------- ADMIN ---------------- */

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/service-slots')
    getAll() {
        return this.service.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/service-slots')
    create(
        @Body()
        body: {
            operatorId: string;
            date: string;        // YYYY-MM-DD
            timeFrom: string;    // 09:00
            timeTo: string;      // 17:00
            maxBookings: number;
            zonePrefix?: string;
        },
    ) {
        return this.service.create({
            operatorId: body.operatorId,
            date: body.date,
            timeFrom: body.timeFrom,
            timeTo: body.timeTo,
            maxBookings: body.maxBookings,
            zonePrefix: body.zonePrefix?.toUpperCase(),
        });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete('admin/service-slots/:id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
