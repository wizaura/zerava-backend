import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingRepository } from './booking.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [BookingController],
    providers: [BookingService, BookingRepository, PrismaService],
})
export class BookingModule { }
