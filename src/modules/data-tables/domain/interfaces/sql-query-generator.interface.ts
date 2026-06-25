import { ColumnSchema } from '../value-objects/column-schema.value-object';

export type QueryOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';

export interface QueryFilter {
  readonly column: string;
  readonly operator: QueryOperator;
  readonly value: string | number | boolean;
}

export interface QueryPlan {
  readonly filters: readonly QueryFilter[];
  readonly limit: number;
}

/**
 * Translates a natural-language question into a structured QueryPlan —
 * never raw SQL text. ExecuteSqlQueryUseCase only ever turns a QueryPlan
 * into parameterized Prisma JSON-path filters (ROLE.md §12: whitelisted
 * table names, never string-built SQL). Implemented today by a local
 * heuristic (HeuristicSqlQueryGeneratorProvider); swapping to a real LLM
 * later just means implementing this interface against ai-service, the
 * same way AiProvider/EmbeddingsProvider do in the ai module — no use case
 * changes.
 */
export interface SqlQueryGenerator {
  generate(question: string, columns: readonly ColumnSchema[]): Promise<QueryPlan>;
}
