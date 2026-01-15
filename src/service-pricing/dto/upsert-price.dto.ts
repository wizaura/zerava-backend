import { ServiceType, VehicleSize } from '@prisma/client';

export class UpsertPriceDto {
    vehicleSize: VehicleSize;
    serviceType: ServiceType;
    price: number;
}
