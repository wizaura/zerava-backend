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
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UpsertPriceDto } from './dto/upsert-price.dto';
import { ServiceType, VehicleSize } from '@prisma/client';

@Controller()
export class ServicePricingController {
    constructor(private readonly service: ServicePricingService) { }

    /* ---------------- ADMIN ---------------- */

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/service-prices')
    upsertPrice(@Body() dto: UpsertPriceDto) {
        return this.service.upsertPrice(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
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
