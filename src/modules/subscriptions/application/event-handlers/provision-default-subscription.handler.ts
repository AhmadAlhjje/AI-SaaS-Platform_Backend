import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CompanyCreatedEvent, COMPANY_CREATED_EVENT } from '../../../companies/domain/events/company-created.event';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { PlanRepository } from '../../domain/repositories/plan.repository';
import { DEFAULT_PLAN_NAME } from '../../domain/value-objects/plan-limits.value-object';
import {
  SUBSCRIPTION_ACTIVATED_EVENT,
  SubscriptionActivatedEvent,
} from '../../domain/events/subscription-activated.event';

@Injectable()
export class ProvisionDefaultSubscriptionHandler {
  constructor(
    @Inject(REPOSITORY_TOKENS.SUBSCRIPTION_REPOSITORY) private readonly subscriptionRepository: SubscriptionRepository,
    @Inject(REPOSITORY_TOKENS.PLAN_REPOSITORY) private readonly planRepository: PlanRepository,
    private readonly eventBus: EventBus,
  ) {}

  @OnEvent(COMPANY_CREATED_EVENT)
  async handle(event: CompanyCreatedEvent): Promise<void> {
    const existing = await this.subscriptionRepository.findActiveByCompanyId(event.companyId);
    if (existing) {
      return;
    }

    const defaultPlan = await this.planRepository.findByName(DEFAULT_PLAN_NAME);
    if (!defaultPlan) {
      return;
    }

    const created = await this.subscriptionRepository.create(
      SubscriptionEntity.createDefault(event.companyId, defaultPlan.id),
    );

    this.eventBus.publish(
      SUBSCRIPTION_ACTIVATED_EVENT,
      new SubscriptionActivatedEvent(created.id as string, created.companyId, created.planId),
    );
  }
}
