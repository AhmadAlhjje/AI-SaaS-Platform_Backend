import { PlanEntity } from '../../domain/entities/plan.entity';

export class PlanResponse {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly limits: { readonly maxDocuments: number; readonly maxDataTables: number };

  constructor(plan: PlanEntity) {
    this.id = plan.id;
    this.name = plan.name;
    this.price = plan.price;
    this.limits = plan.limits;
  }
}
