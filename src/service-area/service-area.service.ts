import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import { ServiceAreaRepository } from './service-area.repository';

@Injectable()
export class ServiceAreaService {
    constructor(private readonly repo: ServiceAreaRepository) { }

    /* -------- PUBLIC -------- */

    async checkAvailability(postcode: string) {
        const rows = await this.repo.findByPostcode(postcode);

        if (!rows.length) {
            return { available: false };
        }

        return {
            available: true,
            weekdays: rows.map((r) => r.weekday),
        };
    }

    /* -------- ADMIN -------- */

    getAll() {
        return this.repo.findAll();
    }

    async create(postcode: string, weekday: number) {
        if (weekday < 0 || weekday > 6) {
            throw new BadRequestException('Invalid weekday');
        }

        return this.repo.create(postcode, weekday);
    }

    delete(id: string) {
        return this.repo.delete(id);
    }
}
