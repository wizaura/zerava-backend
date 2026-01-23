import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import {
    bookingConfirmationTemplate,
    otpTemplate,
    paymentSuccessTemplate,
} from "./mail.templates";

@Injectable()
export class MailService {
    private transporter;
    private logger = new Logger(MailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

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

    async sendOtpEmail(
        to: string,
        otp: string,
        purpose: "LOGIN" | "ADMIN_LOGIN" = "LOGIN",
    ) {
        try {
            await this.transporter.sendMail({
                from: `"Zerava" <${process.env.SMTP_FROM}>`,
                to,
                subject:
                    purpose === "ADMIN_LOGIN"
                        ? "Admin Login OTP"
                        : "Your Login OTP",
                html: otpTemplate({ otp, purpose }),
            });
        } catch (err) {
            this.logger.error("OTP email failed", err);
            // ❗ Never throw
        }
    }

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

    private async sendMail(payload: {
        to: string;
        subject: string;
        html: string;
    }) {
        try {
            await this.transporter.sendMail({
                from: `"Zerava Mobility" <${process.env.SMTP_FROM}>`,
                ...payload,
            });
        } catch (err) {
            this.logger.error("Email send failed", err);
        }
    }
}
