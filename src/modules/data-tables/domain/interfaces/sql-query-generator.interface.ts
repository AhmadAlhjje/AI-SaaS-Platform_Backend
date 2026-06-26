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
 * table names, never string-built SQL). Implemented by
 * HttpSqlQueryGeneratorProvider, which calls ai-service's /sql-agent/query
 * (an LLM-based planner) — `model` lets each company use its own configured
 * model, same as AiProvider/EmbeddingsProvider.
 */
export interface SqlQueryGenerator {
  generate(question: string, columns: readonly ColumnSchema[], model: string): Promise<QueryPlan>;
}
