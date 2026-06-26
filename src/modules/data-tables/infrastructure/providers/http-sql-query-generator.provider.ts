import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiServiceConfig } from '../../../../infrastructure/config/ai-service.config';
import { ColumnSchema } from '../../domain/value-objects/column-schema.value-object';
import { QueryFilter, QueryOperator, QueryPlan, SqlQueryGenerator } from '../../domain/interfaces/sql-query-generator.interface';

interface SqlAgentServiceResponseBody {
  readonly filters: ReadonlyArray<{ column: string; operator: string; value: string | number | boolean }>;
  readonly limit: number;
}

const ALLOWED_OPERATORS: ReadonlySet<string> = new Set<QueryOperator>(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains']);

/**
 * Real LLM-based replacement for the old regex heuristic — calls
 * ai-service's /sql-agent/query, which itself never trusts the model's JSON
 * blindly. This provider re-validates again on the way back in (column
 * whitelist + operator set), the same defense-in-depth ExecuteSqlQueryUseCase
 * already applies to whatever QueryPlan it's handed.
 */
@Injectable()
export class HttpSqlQueryGeneratorProvider implements SqlQueryGenerator {
  constructor(private readonly configService: ConfigService) {}

  async generate(question: string, columns: readonly ColumnSchema[], model: string): Promise<QueryPlan> {
    const config = this.configService.get<AiServiceConfig>('aiService')!;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

    let response: Response;
    try {
      response = await fetch(`${config.baseUrl}/api/v1/sql-agent/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          question,
          model,
          columns: columns.map((column) => ({ name: column.name, type: column.type })),
        }),
      });
    } catch {
      // The SQL agent being unavailable degrades to "no filters" rather than
      // failing the whole request — ExecuteSqlQueryUseCase still runs, just
      // returns an unfiltered (capped) page instead of an error.
      return { filters: [], limit: 50 };
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return { filters: [], limit: 50 };
    }

    const body = (await response.json()) as SqlAgentServiceResponseBody;
    const columnNames = new Set(columns.map((column) => column.name));

    return {
      filters: body.filters.filter((filter): filter is QueryFilter => {
        return columnNames.has(filter.column) && ALLOWED_OPERATORS.has(filter.operator);
      }),
      limit: body.limit,
    };
  }
}
