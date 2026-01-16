import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { ServiceZonesModule } from 'src/service-zones/service-zones.module';
import { ServiceSlotsModule } from 'src/service-slots/service-slots.module';

@Module({
    imports: [ServiceZonesModule, ServiceSlotsModule],
    controllers: [AvailabilityController],
    providers: [AvailabilityService],
})
export class AvailabilityModule { }
