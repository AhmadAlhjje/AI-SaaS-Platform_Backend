import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppConfigModule } from './infrastructure/config/config.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { AiConfigurationModule } from './modules/ai-configuration/ai-configuration.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { DataTablesModule } from './modules/data-tables/data-tables.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { EventBusModule } from './shared/events/event-bus.module';
import { LoggerModule } from './shared/logger/logger.module';

@Module({
  imports: [
    AppConfigModule,
    EventEmitterModule.forRoot(),
    PrismaModule,
    LoggerModule,
    EventBusModule,
    QueueModule,
    AuthModule,
    CompaniesModule,
    SubscriptionsModule,
    DocumentsModule,
    DataTablesModule,
    ConversationsModule,
    AiConfigurationModule,
    AiModule,
    SettingsModule,
  ],
})
export class AppModule {}
