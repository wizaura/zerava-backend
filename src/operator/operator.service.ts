import { BadRequestException, Injectable } from '@nestjs/common';
import { OperatorRepository } from './operator.repository';

@Injectable()
export class OperatorService {
    constructor(private readonly repo: OperatorRepository) { }

    getAll() {
        return this.repo.findAll();
    }

    async create(name: string) {
        if (!name || !name.trim()) {
            throw new BadRequestException('Operator name is required');
        }

        const cleanName = name.trim();

        const existing = await this.repo.findByName(cleanName);

        if (existing && !existing.isActive) {
            await this.repo.reactivate(existing.id);
            await this.repo.reactivateUnbookedSlotsByOperator(existing.id);

            
            return existing;
        }

        if (existing && existing.isActive) {
            throw new BadRequestException('Operator already exists');
        }

        return this.repo.create(cleanName);
    }

    async update(id: string, name: string) {
        if (!name || !name.trim()) {
            throw new BadRequestException('Operator name is required');
        }
        
        return this.repo.update(id, name.trim());
    }

    async delete(id: string) {
        await this.repo.softDelete(id);
        await this.repo.deactivateUnbookedSlotsByOperator(id);
        return { success: true }
    }
}
