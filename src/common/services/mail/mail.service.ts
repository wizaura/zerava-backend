import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";
import {
    bookingConfirmationTemplate,
    otpTemplate,
    paymentSuccessTemplate,
} from "./mail.templates";

@Injectable()
export class MailService {
    private resend: Resend;
    private logger = new Logger(MailService.name);

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    /* ---------- BOOKING CONFIRMATION ---------- */
    async sendBookingConfirmation(data: {
        to: string;
        name: string;
        reference: string;
        date: string;
        timeFrom: string;
        timeTo: string;
        price: number;
    }) {
        await this.sendMail({
            to: data.to,
            subject: `Booking Confirmed – ${data.reference}`,
            html: bookingConfirmationTemplate(data),
        });
    }

    /* ---------- OTP ---------- */
    async sendOtpEmail(
        to: string,
        otp: string,
        purpose: "LOGIN" | "ADMIN_LOGIN" = "LOGIN",
    ) {
        try {
            await this.resend.emails.send({
                from: process.env.MAIL_FROM!,
                to,
                subject:
                    purpose === "ADMIN_LOGIN"
                        ? "Admin Login OTP"
                        : "Your Login OTP",
                html: otpTemplate({ otp, purpose }),
            });
        } catch (err) {
            this.logger.error("OTP email failed", err);
            // ❗ Never throw — auth flow must continue
        }
    }

    /* ---------- PAYMENT SUCCESS ---------- */
    async sendPaymentSuccess(data: {
        to: string;
        name: string;
        reference: string;
        amount: number;
    }) {
        await this.sendMail({
            to: data.to,
            subject: "Payment Successful",
            html: paymentSuccessTemplate(data),
        });
    }

    /* ---------- CORE SEND ---------- */
    private async sendMail(payload: {
        to: string;
        subject: string;
        html: string;
    }) {
        try {
            await this.resend.emails.send({
                from: process.env.MAIL_FROM!,
                ...payload,
            });
        } catch (err) {
            this.logger.error("Email send failed", err);
        }
    }
}
