import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { PlanRepository } from '../../domain/repositories/plan.repository';
import { UsageResource } from '../../domain/value-objects/usage-resource.value-object';
import { PlanNotFoundError } from '../../domain/errors/plan-not-found.error';
import { UsageLimitExceededError } from '../../domain/errors/usage-limit-exceeded.error';
import { GetActiveSubscriptionUseCase } from './get-active-subscription.use-case';

export interface CheckUsageLimitsInput {
  readonly companyId: string;
  readonly resource: UsageResource;
  readonly currentUsage: number;
}

@Injectable()
export class CheckUsageLimitsUseCase {
  constructor(
    private readonly getActiveSubscriptionUseCase: GetActiveSubscriptionUseCase,
    @Inject(REPOSITORY_TOKENS.PLAN_REPOSITORY) private readonly planRepository: PlanRepository,
  ) {}

  async execute(input: CheckUsageLimitsInput): Promise<void> {
    const subscription = await this.getActiveSubscriptionUseCase.execute({ companyId: input.companyId });

    const plan = await this.planRepository.findById(subscription.planId);
    if (!plan) {
      throw new PlanNotFoundError(subscription.planId);
    }

    const limit = input.resource === 'documents' ? plan.limits.maxDocuments : plan.limits.maxDataTables;

    if (input.currentUsage >= limit) {
      throw new UsageLimitExceededError(input.resource, limit);
    }
  }
}
