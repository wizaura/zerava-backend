import { Module } from '@nestjs/common';
import { ServiceZonesController } from './service-zones.controller';
import { ServiceZonesService } from './service-zones.service';
import { ServiceZonesRepository } from './service-zones.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ServiceZonesController],
    providers: [
        ServiceZonesService,
        ServiceZonesRepository,
        PrismaService,
    ],
    exports: [ServiceZonesService],
})
export class ServiceZonesModule { }
