import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';
import { ServicesModule } from './services/services.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { SlotsModule } from './slots/slots.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ServicePricingController } from './service-pricing/service-pricing.controller';
import { ServicePricingService } from './service-pricing/service-pricing.service';
import { ServicePricingModule } from './service-pricing/service-pricing.module';
import { ServiceAreaController } from './service-area/service-area.controller';
import { ServiceAreaService } from './service-area/service-area.service';
import { ServiceAreaModule } from './service-area/service-area.module';
import { BookingController } from './booking/booking.controller';
import { BookingService } from './booking/booking.service';
import { ServicePricingRepository } from './service-pricing/service-pricing.repository';
import { ServiceAreaRepository } from './service-area/service-area.repository';
import { BookingRepository } from './booking/booking.repository';

@Module({
  imports: [AuthModule, UsersModule, BookingModule, ServicesModule, SubscriptionsModule, AdminModule, PaymentsModule, SlotsModule, MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ServicePricingModule,
    ServiceAreaModule,
    BookingModule
  ],
  controllers: [AppController, ServicePricingController, ServiceAreaController, BookingController],
  providers: [AppService, ServicePricingRepository, ServicePricingService, ServiceAreaService, ServiceAreaRepository, BookingService, BookingRepository],
})
export class AppModule {}
