import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import { SlotsRepository } from './slots.repository';

@Injectable()
export class SlotsService {
    constructor(private readonly slotsRepo: SlotsRepository) { }

    /* ---------------- ADMIN ---------------- */

    async createSlots(date: string, slots: { time: string; capacity: number }[]) {
        const slotDate = new Date(date);

        return Promise.all(
            slots.map(async (slot) => {
                try {
                    return await this.slotsRepo.create({
                        date: slotDate,
                        time: slot.time,
                        capacity: slot.capacity,
                    });
                } catch (err) {
                    throw new BadRequestException(
                        `Slot already exists for ${slot.time}`,
                    );
                }
            }),
        );
    }

    async blockSlot(slotId: string) {
        const slot = await this.slotsRepo.findById(slotId);

        if (!slot) throw new BadRequestException('Slot not found');

        if (!slot.isActive)
            throw new BadRequestException('Slot already blocked');

        if (slot.bookings.length >= slot.capacity)
            throw new BadRequestException('Cannot block booked slot');

        return this.slotsRepo.update(slotId, { isActive: false });
    }

    async unblockSlot(slotId: string) {
        const slot = await this.slotsRepo.findById(slotId);

        if (!slot) throw new BadRequestException('Slot not found');

        return this.slotsRepo.update(slotId, { isActive: true });
    }

    /* ---------------- CUSTOMER ---------------- */

    async getAvailableSlots(date: string) {
        const slotDate = new Date(date);

        const slots = await this.slotsRepo.findByDate(slotDate);

        return slots.filter(
            (slot) =>
                slot.isActive && slot.bookings.length < slot.capacity,
        );
    }
}
