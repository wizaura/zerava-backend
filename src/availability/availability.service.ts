import { BadRequestException, Injectable } from '@nestjs/common';
import { ServiceZonesService } from 'src/service-zones/service-zones.service';
import { ServiceSlotsService } from 'src/service-slots/service-slots.service';
import { generateTimeBlocks } from 'src/common/utils/time.util';

@Injectable()
export class AvailabilityService {
    constructor(
        private readonly zonesService: ServiceZonesService,
        private readonly slotsService: ServiceSlotsService,
    ) { }

    async checkAvailability(postcode: string, dateStr: string) {

        if (!postcode || !dateStr) {
            throw new BadRequestException('Postcode and date are required');
        }

        // Normalize postcode prefix (SO16, SO18, etc.)
        const prefix = postcode.trim().split(' ')[0].toUpperCase();

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new BadRequestException('Invalid date');
        }

        date.setHours(0, 0, 0, 0);

        /**
         * JS Date.getDay():
         * 0 = Sunday ... 6 = Saturday
         * Your DB:
         * 1 = Monday ... 7 = Sunday
         */
        const jsDay = date.getDay();
        const serviceDay = jsDay === 0 ? 7 : jsDay;
        console.log('hello 0', serviceDay, prefix)

        /* ---------------- ZONE CHECK ---------------- */

        const zone = await this.zonesService.findZone(prefix, serviceDay);

        console.log('hello', zone)

        if (!zone) {
            return {
                available: false,
                reason: 'NO_ZONE',
                message: 'Service not available in this area on the selected date',
            };
        }

        /* ---------------- SLOT CHECK ---------------- */

        const slots = await this.slotsService.findAvailable(date, prefix);

        console.log(slots, 'jj');

        if (!slots.length) {
            return {
                available: false,
                reason: 'NO_SLOTS',
                zone: {
                    zoneCode: zone.zoneCode,
                    serviceDay,
                },
                slots: [],
            };
        }

        const BLOCK_MINUTES = 120; // 2 hours

        const availableBlocks = slots.flatMap((slot) => {
            const blocks = generateTimeBlocks(slot.timeFrom, slot.timeTo, BLOCK_MINUTES);

            return blocks
                .filter((block) => {
                    // if this exact block is already booked → hide it
                    return !slot.bookings.some(
                        (b) =>
                            b.timeFrom === block.from &&
                            b.timeTo === block.to
                    );
                })
                .map((block) => ({
                    id: `${slot.id}_${block.from}`,
                    serviceSlotId: slot.id,
                    operator: slot.operator.name,
                    timeFrom: block.from,
                    timeTo: block.to,
                }));
        });


        console.log(availableBlocks, 'jh')

        if (!availableBlocks.length) {
            return {
                available: false,
                reason: 'NO_SLOTS',
                zone: {
                    zoneCode: zone.zoneCode,
                    serviceDay,
                },
                message: 'No slots available for this date',
                slots: [],
            };
        }

        console.log('hii')

        /* ---------------- SUCCESS ---------------- */

        return {
            available: true,
            zone: {
                zoneCode: zone.zoneCode,
                serviceDay,
            },
            slots: availableBlocks,
        };
    }
}
