import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { GetUsageSummaryUseCase } from './application/use-cases/get-usage-summary.use-case';
import { UsageController } from './presentation/controllers/usage.controller';

@Module({
  imports: [SubscriptionsModule, DocumentsModule],
  controllers: [UsageController],
  providers: [GetUsageSummaryUseCase],
})
export class UsageModule {}
