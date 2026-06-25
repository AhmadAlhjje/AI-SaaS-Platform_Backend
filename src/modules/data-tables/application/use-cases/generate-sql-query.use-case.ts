import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { DataTableNotFoundError } from '../../domain/errors/data-table-not-found.error';
import { QueryPlan, SqlQueryGenerator } from '../../domain/interfaces/sql-query-generator.interface';
import { DataTableRepository } from '../../domain/repositories/data-table.repository';

export interface GenerateSqlQueryInput {
  readonly dataTableId: string;
  readonly companyId: string;
  readonly question: string;
}

/**
 * The whitelist check (ROLE.md §12): a DataTable is only ever resolved by
 * (id, companyId) through the repository — a parameterized lookup, never a
 * raw table name supplied by the caller. ExecuteSqlQueryUseCase re-resolves
 * independently rather than trusting this result, the same defensive
 * pattern DeleteDocumentUseCase uses for ownership checks.
 */
@Injectable()
export class GenerateSqlQueryUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY) private readonly dataTableRepository: DataTableRepository,
    @Inject(PROVIDER_TOKENS.SQL_QUERY_GENERATOR) private readonly sqlQueryGenerator: SqlQueryGenerator,
  ) {}

  async execute(input: GenerateSqlQueryInput): Promise<QueryPlan> {
    const dataTable = await this.dataTableRepository.findById(input.dataTableId);

    if (!dataTable || dataTable.companyId !== input.companyId) {
      throw new DataTableNotFoundError(input.dataTableId);
    }

    return this.sqlQueryGenerator.generate(input.question, dataTable.columns);
  }
}
