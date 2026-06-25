export interface PlanLimits {
  readonly maxDocuments: number;
  readonly maxDataTables: number;
}

/** The plan auto-assigned to every newly created company — must exist in the
 * seeded Plan data (see prisma/seed.ts). */
export const DEFAULT_PLAN_NAME = 'free';
