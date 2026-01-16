import { BadRequestException, Injectable } from '@nestjs/common';
import { ServiceSlotsRepository } from './service-slots.repository';

interface CreateSlotInput {
    operatorId: string;
    date: string;
    timeFrom: string;
    timeTo: string;
    maxBookings: number;
    zonePrefix?: string;
}

@Injectable()
export class ServiceSlotsService {
    constructor(private readonly repo: ServiceSlotsRepository) { }

    /* -------- ADMIN -------- */

    getAll() {
        return this.repo.findAll();
    }

    async create(input: CreateSlotInput) {
        
        const date = new Date(input.date);
        date.setHours(0, 0, 0, 0);

        if (input.maxBookings < 1) {
            throw new BadRequestException('maxBookings must be at least 1');
        }

        if (input.timeFrom >= input.timeTo) {
            throw new BadRequestException('timeFrom must be before timeTo');
        }

        return this.repo.create({
            operatorId: input.operatorId,
            date,
            timeFrom: input.timeFrom,
            timeTo: input.timeTo,
            maxBookings: input.maxBookings,
            zonePrefix: input.zonePrefix,
        });
    }

    delete(id: string) {
        return this.repo.delete(id);
    }

    /* -------- INTERNAL (used later by availability) -------- */

    findAvailable(date: Date, zonePrefix: string) {
        return this.repo.findAvailable(date, zonePrefix);
    }
}
