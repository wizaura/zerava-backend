import { Injectable } from '@nestjs/common';
import { ServicePricingRepository } from './service-pricing.repository';
import { UpsertPriceDto } from './dto/upsert-price.dto';
import { ServiceType, VehicleSize } from '@prisma/client';

@Injectable()
export class ServicePricingService {
    constructor(private readonly repo: ServicePricingRepository) { }

    upsertPrice(dto: UpsertPriceDto) {
        return this.repo.upsert({
            vehicleSize: dto.vehicleSize,
            serviceType: dto.serviceType,
            price: dto.price,
            isActive: true,
        });
    }

    getPublicPrices() {
        return this.repo.findActive();
    }

    deactivatePrice(vehicleSize: VehicleSize, serviceType: ServiceType) {
        return this.repo.deactivate(vehicleSize, serviceType);
    }
}
