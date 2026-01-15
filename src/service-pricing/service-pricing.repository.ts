import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ServiceType, VehicleSize } from '@prisma/client';

@Injectable()
export class ServicePricingRepository {
    constructor(private readonly prisma: PrismaService) { }

    upsert(data: Prisma.ServicePriceUncheckedCreateInput) {
        return this.prisma.servicePrice.upsert({
            where: {
                vehicleSize_serviceType: {
                    vehicleSize: data.vehicleSize,
                    serviceType: data.serviceType,
                },
            },
            update: {
                price: data.price,
                isActive: true,
            },
            create: data,
        });
    }

    findActive() {
        return this.prisma.servicePrice.findMany({
            where: { isActive: true },
            orderBy: [{ vehicleSize: 'asc' }, { serviceType: 'asc' }],
        });
    }

    deactivate(vehicleSize: VehicleSize, serviceType: ServiceType) {
        return this.prisma.servicePrice.update({
            where: {
                vehicleSize_serviceType: { vehicleSize, serviceType },
            },
            data: { isActive: false },
        });
    }
}
