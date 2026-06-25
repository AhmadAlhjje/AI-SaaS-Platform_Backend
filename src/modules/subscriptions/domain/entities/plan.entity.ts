import { PlanLimits } from '../value-objects/plan-limits.value-object';

interface ReconstituteProps {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly limits: PlanLimits;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Plans are static, seeded data (prisma/seed.ts) — there is no factory/create()
 * here on purpose, only reconstitution from a row that already exists.
 */
export class PlanEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly limits: PlanLimits,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static reconstitute(props: ReconstituteProps): PlanEntity {
    return new PlanEntity(props.id, props.name, props.price, props.limits, props.createdAt, props.updatedAt);
  }
}
