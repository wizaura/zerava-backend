import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OperatorRepository {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.operator.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    create(name: string) {
        return this.prisma.operator.create({
            data: {
                name,
                isActive: true,
            },
        });
    }
}
