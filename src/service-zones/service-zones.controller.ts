import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ServiceZonesService } from './service-zones.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller()
export class ServiceZonesController {
    constructor(private readonly service: ServiceZonesService) { }

    /* ---------------- PUBLIC ---------------- */

    @Get('service-zones/check/:postcode')
    checkPostcode(@Param('postcode') postcode: string) {
        return this.service.checkPostcode(postcode.toUpperCase());
    }

    /* ---------------- ADMIN ---------------- */

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/service-zones')
    getAll() {
        return this.service.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/service-zones')
    create(
        @Body()
        body: {
            postcodePrefix: string;
            serviceDay: number;
            zoneCode: string;
        },
    ) {
        return this.service.create(
            body.postcodePrefix.toUpperCase(),
            body.serviceDay,
            body.zoneCode.toUpperCase(),
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete('admin/service-zones/:id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
