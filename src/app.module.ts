import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { ServicesModule } from './services/services.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { ServicePricingModule } from './service-pricing/service-pricing.module';
import { ServiceZonesModule } from './service-zones/service-zones.module';
import { ServiceSlotsModule } from './service-slots/service-slots.module';
import { AvailabilityModule } from './availability/availability.module';
import { OperatorModule } from './operator/operator.module';
import { AdminAuthModule } from './auth/admin-auth/admin-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    AuthModule,
    UserModule,
    BookingModule,
    ServicesModule,
    SubscriptionsModule,
    AdminModule,
    AdminAuthModule,
    PaymentsModule,

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
