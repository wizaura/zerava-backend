import { BadRequestException, Injectable } from '@nestjs/common';
import { ServiceZonesRepository } from './service-zones.repository';

@Injectable()
export class ServiceZonesService {
    constructor(private readonly repo: ServiceZonesRepository) { }

     /* -------- PUBLIC -------- */

    async checkPostcode(postcode: string) {
        const prefix = postcode.trim().split(' ')[0];

        const zones = await this.repo.findByPrefix(prefix);

        if (!zones.length) {
            return { available: false };
        }

        return {
            available: true,
            serviceDays: zones.map((z) => z.serviceDay),
        };
    }

    /* -------- ADMIN -------- */

    getAll() {
        return this.repo.findAll();
    }

    async create(
        postcodePrefix: string,
        serviceDay: number,
        zoneCode: string,
    ) {
        if (serviceDay < 1 || serviceDay > 7) {
            throw new BadRequestException('serviceDay must be between 1 and 7');
        }

        if (!postcodePrefix || postcodePrefix.length < 2) {
            throw new BadRequestException('Invalid postcode prefix');
        }

        if (!zoneCode) {
            throw new BadRequestException('Zone code is required');
        }

        return this.repo.create(postcodePrefix, serviceDay, zoneCode);
    }

    delete(id: string) {
        return this.repo.delete(id);
    }

    /* -------- INTERNAL (used later by availability) -------- */

    findZone(postcodePrefix: string, serviceDay: number) {
        return this.repo.findByPrefixAndDay(postcodePrefix, serviceDay);
    }
}
