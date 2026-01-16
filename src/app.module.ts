import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';
import { ServicesModule } from './services/services.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { MailModule } from './mail/mail.module';
import { ServicePricingModule } from './service-pricing/service-pricing.module';
import { ServiceZonesModule } from './service-zones/service-zones.module';
import { ServiceSlotsModule } from './service-slots/service-slots.module';
import { AvailabilityModule } from './availability/availability.module';
import { OperatorModule } from './operator/operator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    AuthModule,
    UsersModule,
    BookingModule,
    ServicesModule,
    SubscriptionsModule,
    AdminModule,
    PaymentsModule,
    MailModule,

    ServicePricingModule,
    ServiceZonesModule,
    ServiceSlotsModule,
    AvailabilityModule,
    OperatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
