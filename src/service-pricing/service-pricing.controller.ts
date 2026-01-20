import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ServicePricingService } from './service-pricing.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UpsertPriceDto } from './dto/upsert-price.dto';
import { ServiceType, VehicleSize } from '@prisma/client';
import { AdminJwtAuthGuard } from 'src/auth/admin-auth/jwt/jwt.guard';

@Controller()
export class ServicePricingController {
    constructor(private readonly service: ServicePricingService) { }

    /* ---------------- ADMIN ---------------- */

    @UseGuards(AdminJwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/service-prices')
    upsertPrice(@Body() dto: UpsertPriceDto) {
        return this.service.upsertPrice(dto);
    }

    @UseGuards(AdminJwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch('admin/service-prices/deactivate')
    deactivate(
        @Query('vehicleSize') vehicleSize: VehicleSize,
        @Query('serviceType') serviceType: ServiceType,
    ) {
        return this.service.deactivatePrice(vehicleSize, serviceType);
    }

    /* ---------------- PUBLIC ---------------- */

    @Get('services/prices')
    getPrices() {
        return this.service.getPublicPrices();
    }
}
