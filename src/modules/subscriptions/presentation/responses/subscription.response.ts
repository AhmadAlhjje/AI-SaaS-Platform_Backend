import { PlanEntity } from '../../domain/entities/plan.entity';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';

export class SubscriptionResponse {
  readonly id: string;
  readonly status: string;
  readonly startDate: Date;
  readonly endDate: Date | null;
  readonly plan: {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly limits: {
      readonly maxDocuments: number;
      readonly maxDataTables: number;
    };
  };

  constructor(subscription: SubscriptionEntity, plan: PlanEntity) {
    this.id = subscription.id!;
    this.status = subscription.status;
    this.startDate = subscription.startDate;
    this.endDate = subscription.endDate;
    this.plan = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      limits: plan.limits,
    };
  }
}
