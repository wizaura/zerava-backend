import { Module } from '@nestjs/common';
import { ServiceAreaController } from './service-area.controller';
import { ServiceAreaService } from './service-area.service';
import { ServiceAreaRepository } from './service-area.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ServiceAreaController],
    providers: [
        ServiceAreaService,
        ServiceAreaRepository,
        PrismaService,
    ],
})
export class ServiceAreaModule { }
