import { BadRequestException, Injectable } from '@nestjs/common';
import { OperatorRepository } from './operator.repository';

@Injectable()
export class OperatorService {
    constructor(private readonly repo: OperatorRepository) {}

    getAll() {
        return this.repo.findAll();
    }

    async create(name: string) {
        if (!name || !name.trim()) {
            throw new BadRequestException('Operator name is required');
        }

        return this.repo.create(name.trim());
    }
}
