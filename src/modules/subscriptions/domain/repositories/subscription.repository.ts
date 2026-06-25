import { SubscriptionEntity } from '../entities/subscription.entity';

export interface SubscriptionRepository {
  /** A company's current ACTIVE subscription (status active, not yet expired). */
  findActiveByCompanyId(companyId: string): Promise<SubscriptionEntity | null>;
  create(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
}
