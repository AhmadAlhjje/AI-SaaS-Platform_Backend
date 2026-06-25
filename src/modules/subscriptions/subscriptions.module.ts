import { Module } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { ProvisionDefaultSubscriptionHandler } from './application/event-handlers/provision-default-subscription.handler';
import { CheckUsageLimitsUseCase } from './application/use-cases/check-usage-limits.use-case';
import { GetActiveSubscriptionUseCase } from './application/use-cases/get-active-subscription.use-case';
import { PrismaPlanRepository } from './infrastructure/repositories/prisma-plan.repository';
import { PrismaSubscriptionRepository } from './infrastructure/repositories/prisma-subscription.repository';

@Module({
  providers: [
    GetActiveSubscriptionUseCase,
    CheckUsageLimitsUseCase,
    ProvisionDefaultSubscriptionHandler,
    { provide: REPOSITORY_TOKENS.PLAN_REPOSITORY, useClass: PrismaPlanRepository },
    { provide: REPOSITORY_TOKENS.SUBSCRIPTION_REPOSITORY, useClass: PrismaSubscriptionRepository },
  ],
  // Exported so other modules (e.g. Documents) can gate actions against plan
  // limits as a public application service (ROLE.md §7) without reaching
  // into this module's repositories directly.
  exports: [CheckUsageLimitsUseCase],
})
export class SubscriptionsModule {}
