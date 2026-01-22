import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OperatorRepository {
    constructor(private readonly prisma: PrismaService) { }

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

    update(id: string, name: string) {
        return this.prisma.operator.update({
            where: { id },
            data: { name },
        });
    }

    softDelete(id: string) {
        return this.prisma.operator.update({
            where: { id },
            data: { isActive: false },
        });
    }

    findByName(name: string) {
        return this.prisma.operator.findUnique({
            where: { name },
        });
    }

    reactivate(id: string) {
        return this.prisma.operator.update({
            where: { id },
            data: { isActive: true },
        });
    }

    reactivateUnbookedSlotsByOperator(operatorId: string) {
        return this.prisma.serviceSlot.updateMany({
            where: {
                operatorId,
                bookings: {
                    none: {},
                },
            },
            data: {
                status: "ACTIVE",
            },
        });
    }


    deactivateUnbookedSlotsByOperator(operatorId: string) {
        return this.prisma.serviceSlot.updateMany({
            where: {
                operatorId,
                bookings: {
                    none: {},
                },
            },
            data: {
                status: "INACTIVE",
            },
        });
    }


}
