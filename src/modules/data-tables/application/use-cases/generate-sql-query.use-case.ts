import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { GetAiConfigurationUseCase } from '../../../ai-configuration/application/use-cases/get-ai-configuration.use-case';
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
 *
 * Uses this company's own configured model (AiConfiguration, a public
 * application service per ROLE.md §7) so the SQL agent honors the same
 * per-company model choice as plain chat answers.
 */
@Injectable()
export class GenerateSqlQueryUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY) private readonly dataTableRepository: DataTableRepository,
    @Inject(PROVIDER_TOKENS.SQL_QUERY_GENERATOR) private readonly sqlQueryGenerator: SqlQueryGenerator,
    private readonly getAiConfigurationUseCase: GetAiConfigurationUseCase,
  ) {}

  async execute(input: GenerateSqlQueryInput): Promise<QueryPlan> {
    const dataTable = await this.dataTableRepository.findById(input.dataTableId);

    if (!dataTable || dataTable.companyId !== input.companyId) {
      throw new DataTableNotFoundError(input.dataTableId);
    }

    const config = await this.getAiConfigurationUseCase.execute({ companyId: input.companyId });
    return this.sqlQueryGenerator.generate(input.question, dataTable.columns, config.model);
  }
}
