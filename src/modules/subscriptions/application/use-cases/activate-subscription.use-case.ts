import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { PlanNotFoundError } from '../../domain/errors/plan-not-found.error';
import { SUBSCRIPTION_ACTIVATED_EVENT, SubscriptionActivatedEvent } from '../../domain/events/subscription-activated.event';
import { PlanRepository } from '../../domain/repositories/plan.repository';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';

export interface ActivateSubscriptionInput {
  readonly companyId: string;
  readonly planId: string;
}

/**
 * Switches a company to a different plan. No billing integration exists yet
 * (ROLE.md scope) — this just cancels whatever subscription is currently
 * active and activates the new plan immediately, relying on the partial
 * unique index (schema.prisma: one ACTIVE subscription per company) to keep
 * exactly one in force. The cancel must complete before the create, or the
 * index would reject the new row while the old one is still active.
 */
@Injectable()
export class ActivateSubscriptionUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.PLAN_REPOSITORY) private readonly planRepository: PlanRepository,
    @Inject(REPOSITORY_TOKENS.SUBSCRIPTION_REPOSITORY) private readonly subscriptionRepository: SubscriptionRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: ActivateSubscriptionInput): Promise<SubscriptionEntity> {
    const plan = await this.planRepository.findById(input.planId);
    if (!plan) {
      throw new PlanNotFoundError(input.planId);
    }

    const existing = await this.subscriptionRepository.findActiveByCompanyId(input.companyId);
    if (existing && existing.planId === plan.id) {
      return existing;
    }

    if (existing) {
      await this.subscriptionRepository.cancel(existing.id!);
    }

    const created = await this.subscriptionRepository.create(SubscriptionEntity.createDefault(input.companyId, plan.id));

    this.eventBus.publish(
      SUBSCRIPTION_ACTIVATED_EVENT,
      new SubscriptionActivatedEvent(created.id!, created.companyId, created.planId),
    );

    return created;
  }
}
