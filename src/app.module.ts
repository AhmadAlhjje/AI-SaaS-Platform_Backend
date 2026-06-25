import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppConfigModule } from './infrastructure/config/config.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { EventBusModule } from './shared/events/event-bus.module';
import { LoggerModule } from './shared/logger/logger.module';

@Module({
  imports: [
    AppConfigModule,
    EventEmitterModule.forRoot(),
    PrismaModule,
    LoggerModule,
    EventBusModule,
    AuthModule,
    CompaniesModule,
    DocumentsModule,
  ],
})
export class AppModule {}
