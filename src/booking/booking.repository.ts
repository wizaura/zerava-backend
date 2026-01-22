import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBookingDto } from "./booking.dto";
import { BookingStatus, Prisma } from "@prisma/client";

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

            if (!slot) {
                throw new BadRequestException("Slot not found");
            }

            if (slot.status !== "ACTIVE") {
                throw new BadRequestException("Slot inactive");
            }

            // 🚨 Time overlap check
            const overlapping = slot.bookings.some(
                (b) =>
                    !(dto.timeTo <= b.timeFrom || dto.timeFrom >= b.timeTo)
            );

            if (overlapping) {
                throw new BadRequestException(
                    "This time block is already booked"
                );
            }

            if (slot.bookings.length >= slot.maxBookings) {
                throw new BadRequestException("Slot fully booked");
            }

            const ref = await this.generateUniqueRef(tx);

            return tx.booking.create({
                data: {
                    // 🔐 USER LINK (NEW)
                    userId: dto.userId,

                    serviceSlotId: slot.id,
                    referenceCode: ref,

                    timeFrom: dto.timeFrom,
                    timeTo: dto.timeTo,

                    serviceType: dto.serviceType,
                    vehicleSize: dto.vehicleSize,
                    price: dto.price,

                    // 📸 SNAPSHOT DATA
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

    /* ---------- USER BOOKINGS ---------- */

    async findByUser(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                referenceCode: true,
                status: true,
                price: true,
                createdAt: true,

                serviceSlot: {
                    select: {
                        date: true,
                        timeFrom: true,
                        timeTo: true,
                        operator: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }

    /* ---------- ADMIN BOOKINGS ---------- */

    async findForAdmin(filters: {
        search?: string;
        status?: BookingStatus;
    }) {
        return this.prisma.booking.findMany({
            where: {
                ...(filters.status && {
                    status: filters.status,
                }),
                ...(filters.search && {
                    OR: [
                        {
                            referenceCode: {
                                contains: filters.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            name: {
                                contains: filters.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: filters.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            postcode: {
                                contains: filters.search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }),
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                referenceCode: true,
                name: true,
                email: true,
                serviceType: true,
                price: true,
                status: true,
                createdAt: true,

                serviceSlot: {
                    select: {
                        date: true,
                    },
                },
            },
        });
    }
}
