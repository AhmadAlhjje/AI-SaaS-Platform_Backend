import { PlanEntity } from '../entities/plan.entity';

export interface PlanRepository {
  findById(id: string): Promise<PlanEntity | null>;
  findByName(name: string): Promise<PlanEntity | null>;
}
