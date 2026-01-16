import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceZonesRepository {
    constructor(private readonly prisma: PrismaService) { }

    findByPrefix(prefix: string) {
        return this.prisma.serviceZone.findMany({
            where: {
                postcodePrefix: prefix,
                isActive: true,
            },
            select: {
                serviceDay: true,
            },
            orderBy: { serviceDay: 'asc' },
        });
    }

    findAll() {
        return this.prisma.serviceZone.findMany({
            where: { isActive: true },
            orderBy: [
                { serviceDay: 'asc' },
                { postcodePrefix: 'asc' },
            ],
        });
    }

    findByPrefixAndDay(postcodePrefix: string, serviceDay: number) {
        return this.prisma.serviceZone.findFirst({
            where: {
                postcodePrefix,
                serviceDay,
                isActive: true,
            },
        });
    }

    create(
        postcodePrefix: string,
        serviceDay: number,
        zoneCode: string,
    ) {
        return this.prisma.serviceZone.create({
            data: {
                postcodePrefix,
                serviceDay,
                zoneCode,
                isActive: true,
            },
        });
    }

    delete(id: string) {
        return this.prisma.serviceZone.delete({
            where: { id },
        });
    }
}
