import { Module } from '@nestjs/common';
import { ServiceSlotsController } from './service-slots.controller';
import { ServiceSlotsService } from './service-slots.service';
import { ServiceSlotsRepository } from './service-slots.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ServiceSlotsController],
    providers: [
        ServiceSlotsService,
        ServiceSlotsRepository,
        PrismaService,
    ],
    exports: [ServiceSlotsService],
})
export class ServiceSlotsModule { }
