import { Module } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { ProvisionDefaultSubscriptionHandler } from './application/event-handlers/provision-default-subscription.handler';
import { ActivateSubscriptionUseCase } from './application/use-cases/activate-subscription.use-case';
import { CheckUsageLimitsUseCase } from './application/use-cases/check-usage-limits.use-case';
import { GetActiveSubscriptionUseCase } from './application/use-cases/get-active-subscription.use-case';
import { GetMySubscriptionUseCase } from './application/use-cases/get-my-subscription.use-case';
import { ListPlansUseCase } from './application/use-cases/list-plans.use-case';
import { PrismaPlanRepository } from './infrastructure/repositories/prisma-plan.repository';
import { PrismaSubscriptionRepository } from './infrastructure/repositories/prisma-subscription.repository';
import { PlansController } from './presentation/controllers/plans.controller';
import { SubscriptionsController } from './presentation/controllers/subscriptions.controller';

@Module({
  controllers: [SubscriptionsController, PlansController],
  providers: [
    GetActiveSubscriptionUseCase,
    GetMySubscriptionUseCase,
    CheckUsageLimitsUseCase,
    ListPlansUseCase,
    ActivateSubscriptionUseCase,
    ProvisionDefaultSubscriptionHandler,
    { provide: REPOSITORY_TOKENS.PLAN_REPOSITORY, useClass: PrismaPlanRepository },
    { provide: REPOSITORY_TOKENS.SUBSCRIPTION_REPOSITORY, useClass: PrismaSubscriptionRepository },
  ],
  // Exported so other modules (e.g. Documents, Usage) can read plan limits
  // and gate actions against them as public application services
  // (ROLE.md §7) without reaching into this module's repositories directly.
  exports: [CheckUsageLimitsUseCase, GetMySubscriptionUseCase],
})
export class SubscriptionsModule {}
