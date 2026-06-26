import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { PlanEntity } from '../../domain/entities/plan.entity';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { PlanNotFoundError } from '../../domain/errors/plan-not-found.error';
import { PlanRepository } from '../../domain/repositories/plan.repository';
import { GetActiveSubscriptionUseCase } from './get-active-subscription.use-case';

export interface GetMySubscriptionInput {
  readonly companyId: string;
}

export interface MySubscription {
  readonly subscription: SubscriptionEntity;
  readonly plan: PlanEntity;
}

@Injectable()
export class GetMySubscriptionUseCase {
  constructor(
    private readonly getActiveSubscriptionUseCase: GetActiveSubscriptionUseCase,
    @Inject(REPOSITORY_TOKENS.PLAN_REPOSITORY) private readonly planRepository: PlanRepository,
  ) {}

  async execute(input: GetMySubscriptionInput): Promise<MySubscription> {
    const subscription = await this.getActiveSubscriptionUseCase.execute({ companyId: input.companyId });

    const plan = await this.planRepository.findById(subscription.planId);
    if (!plan) {
      throw new PlanNotFoundError(subscription.planId);
    }

    return { subscription, plan };
  }
}
