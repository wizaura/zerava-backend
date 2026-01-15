import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ServiceAreaService } from './service-area.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller()
export class ServiceAreaController {
    constructor(private readonly service: ServiceAreaService) { }

    /* ---------------- PUBLIC ---------------- */

    @Get('service-areas/:postcode')
    checkPostcode(@Param('postcode') postcode: string) {
        return this.service.checkAvailability(postcode.toUpperCase());
    }

    /* ---------------- ADMIN ---------------- */

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/service-areas')
    getAll() {
        return this.service.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/service-areas')
    create(
        @Body()
        body: {
            postcode: string;
            weekday: number;
        },
    ) {
        return this.service.create(
            body.postcode.toUpperCase(),
            body.weekday,
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete('admin/service-areas/:id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
