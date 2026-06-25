import { SubscriptionStatus } from '../value-objects/subscription-status.value-object';

interface ReconstituteProps {
  readonly id: string;
  readonly companyId: string;
  readonly planId: string;
  readonly status: SubscriptionStatus;
  readonly startDate: Date;
  readonly endDate: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * `id` is null until persisted. One company can have several historical
 * subscriptions (plan upgrades, cancellations) but at most one truly active
 * one — that invariant is enforced by SubscriptionRepository's query, not
 * here.
 */
export class SubscriptionEntity {
  private constructor(
    public readonly id: string | null,
    public readonly companyId: string,
    public readonly planId: string,
    public readonly status: SubscriptionStatus,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static createDefault(companyId: string, planId: string): SubscriptionEntity {
    const now = new Date();
    return new SubscriptionEntity(null, companyId, planId, SubscriptionStatus.ACTIVE, now, null, now, now);
  }

  static reconstitute(props: ReconstituteProps): SubscriptionEntity {
    return new SubscriptionEntity(
      props.id,
      props.companyId,
      props.planId,
      props.status,
      props.startDate,
      props.endDate,
      props.createdAt,
      props.updatedAt,
    );
  }
}
