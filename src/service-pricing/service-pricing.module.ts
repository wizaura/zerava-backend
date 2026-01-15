import { Module } from '@nestjs/common';
import { ServicePricingController } from './service-pricing.controller';
import { ServicePricingService } from './service-pricing.service';
import { ServicePricingRepository } from './service-pricing.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ServicePricingController],
    providers: [
        ServicePricingService,
        ServicePricingRepository,
        PrismaService,
    ],
})
export class ServicePricingModule { }
