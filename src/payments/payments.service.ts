import Stripe from "stripe";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MailService } from "src/common/services/mail/mail.service";

@Injectable()
export class PaymentsService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-12-15.clover",
    });

    constructor(
        private prisma: PrismaService,
        private mail: MailService
    ) { }

    async createCheckoutSession(bookingId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) throw new Error("Booking not found");

        return this.stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "gbp",
                    product_data: { name: "Zerava Car Wash Service" },
                    unit_amount: booking.price,
                },
                quantity: 1,
            }],
            success_url: `${process.env.FRONTEND_URL}/booking/success?ref=${booking.referenceCode}`,
            cancel_url: `${process.env.FRONTEND_URL}/booking/cancel?ref=${booking.referenceCode}`,
            metadata: {
                bookingId: booking.id,
                ref: booking.referenceCode,
            },
        });
    }

    async handleWebhook(event: Stripe.Event) {
        if (event.type !== "checkout.session.completed") return;

        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) return;

        // Idempotency check (VERY IMPORTANT)
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking || booking.status === "CONFIRMED") return;

        // Update booking
        await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
        });

        // SEND PAYMENT SUCCESS EMAIL
        await this.mail.sendPaymentSuccess({
            to: booking.email,
            name: booking.name,
            reference: booking.referenceCode as string,
            amount: booking.price,
        });
    }
}
