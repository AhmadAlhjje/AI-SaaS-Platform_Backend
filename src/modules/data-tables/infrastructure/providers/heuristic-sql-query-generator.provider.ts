import { Injectable } from '@nestjs/common';
import { ColumnSchema } from '../../domain/value-objects/column-schema.value-object';
import { QueryFilter, QueryOperator, QueryPlan, SqlQueryGenerator } from '../../domain/interfaces/sql-query-generator.interface';

const DEFAULT_LIMIT = 50;
const NUMBER_PATTERN = /-?\d+(\.\d+)?/;

/**
 * Local, deterministic stand-in for an LLM-based query planner — plays the
 * same role ai-service's mock /ask and /embeddings endpoints play for
 * AiProvider/EmbeddingsProvider. Looks for column names mentioned in the
 * question plus a handful of comparison keywords near them, and builds a
 * QueryPlan from that. Swapping in a real LLM later means implementing
 * SqlQueryGenerator against ai-service — GenerateSqlQueryUseCase and
 * ExecuteSqlQueryUseCase don't change.
 */
@Injectable()
export class HeuristicSqlQueryGeneratorProvider implements SqlQueryGenerator {
  async generate(question: string, columns: readonly ColumnSchema[]): Promise<QueryPlan> {
    const lowerQuestion = question.toLowerCase();
    const filters: QueryFilter[] = [];

    for (const column of columns) {
      const columnIndex = lowerQuestion.indexOf(column.name.toLowerCase());
      if (columnIndex === -1) {
        continue;
      }

      const tail = lowerQuestion.slice(columnIndex + column.name.length);

      if (column.type === 'number') {
        const numberMatch = tail.match(NUMBER_PATTERN);
        if (numberMatch) {
          filters.push({ column: column.name, operator: this.detectOperator(tail), value: Number(numberMatch[0]) });
          continue;
        }
      }

      const wordMatch = tail.match(/^[^a-z0-9]*([a-z0-9_]+)/i);
      if (wordMatch) {
        filters.push({ column: column.name, operator: 'contains', value: wordMatch[1] });
      }
    }

    return { filters, limit: DEFAULT_LIMIT };
  }

  private detectOperator(tail: string): QueryOperator {
    if (/greater than or equal|at least|>=/.test(tail)) return 'gte';
    if (/less than or equal|at most|<=/.test(tail)) return 'lte';
    if (/greater than|more than|above|>/.test(tail)) return 'gt';
    if (/less than|below|</.test(tail)) return 'lt';
    if (/not\s/.test(tail)) return 'neq';
    return 'eq';
  }
}
