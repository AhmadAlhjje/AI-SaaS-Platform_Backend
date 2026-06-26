import { SubscriptionEntity } from '../entities/subscription.entity';

export interface SubscriptionRepository {
  /** A company's current ACTIVE subscription (status active, not yet expired). */
  findActiveByCompanyId(companyId: string): Promise<SubscriptionEntity | null>;
  create(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
  /** Marks a subscription cancelled and stamps endDate — frees the partial unique index for a new active one. */
  cancel(id: string): Promise<void>;
}
