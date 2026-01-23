import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [PaymentsController],
    providers: [PaymentsService, PrismaService],
})
export class PaymentsModule { }
