import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const SUBSCRIPTION_ACTIVATED_EVENT = 'subscription.activated';

export class SubscriptionActivatedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly subscriptionId: string,
    public readonly companyId: string,
    public readonly planId: string,
  ) {}
}
