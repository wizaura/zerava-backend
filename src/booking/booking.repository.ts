import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBookingDto } from "./booking.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class BookingRepository {
    constructor(private readonly prisma: PrismaService) { }

    private async generateUniqueRef(tx: Prisma.TransactionClient) {
        while (true) {
            const ref = "ZRV-" + Math.floor(100000 + Math.random() * 900000);
            const exists = await tx.booking.findUnique({
                where: { referenceCode: ref },
            });
            if (!exists) return ref;
        }
    }

    async createWithSlotLock(dto: CreateBookingDto) {
        return this.prisma.$transaction(async (tx) => {

            const realSlotId = dto.serviceSlotId.split("_")[0];

            const slot = await tx.serviceSlot.findUnique({
                where: { id: realSlotId },
                include: { bookings: true },
            });

            console.log(slot, 'hh')

            if (!slot) throw new BadRequestException("Slot not found");
            if (slot.status !== "ACTIVE") throw new BadRequestException("Slot inactive");

            // 🚨 Block-level collision check
            const overlapping = slot.bookings.some(b =>
                !(dto.timeTo <= b.timeFrom || dto.timeFrom >= b.timeTo)
            );

            if (overlapping)
                throw new BadRequestException("This time block is already booked");

            if (slot.bookings.length >= slot.maxBookings)
                throw new BadRequestException("Slot fully booked");

            const ref = await this.generateUniqueRef(tx);
            console.log(ref,'ref')

            return tx.booking.create({
                data: {
                    serviceSlotId: slot.id,
                    referenceCode: ref,
                    timeFrom: dto.timeFrom,
                    timeTo: dto.timeTo,

                    serviceType: dto.serviceType,
                    vehicleSize: dto.vehicleSize,
                    price: dto.price,

                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,

                    address: dto.address,
                    postcode: dto.postcode,
                    notes: dto.notes,
                    status: "PENDING_PAYMENT",
                },
            });
        });
    }
}
