import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import type { Request, Response } from "express";
import Stripe from "stripe";

@Controller("payments")
export class PaymentsController {
    constructor(private readonly payments: PaymentsService) { }

    @Post("create-session")
    createSession(@Body("bookingId") bookingId: string) {
        return this.payments.createCheckoutSession(bookingId);
    }

    @Post("webhook")
    async webhook(@Req() req: Request, @Res() res: Response) {
        const sig = req.headers["stripe-signature"];
        const event = Stripe.webhooks.constructEvent(
            req.body,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        await this.payments.handleWebhook(event);
        res.json({ received: true });
    }
}
