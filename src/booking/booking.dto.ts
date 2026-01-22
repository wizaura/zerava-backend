import { ServiceType, VehicleSize } from "@prisma/client";

export class CreateBookingDto {
    serviceSlotId: string;
    timeFrom: string;
    timeTo: string;

    userId: string;

    serviceType: ServiceType;
    vehicleSize: VehicleSize;
    price: number;

    name: string;
    email: string;
    phone: string;

    address: string;
    postcode: string;
    notes?: string;
}
