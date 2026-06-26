import { Injectable } from '@nestjs/common';
import { DataTableRowEntity } from '../../../data-tables/domain/entities/data-table-row.entity';
import { ExecuteSqlQueryUseCase } from '../../../data-tables/application/use-cases/execute-sql-query.use-case';
import { GenerateSqlQueryUseCase } from '../../../data-tables/application/use-cases/generate-sql-query.use-case';
import { ListDataTablesUseCase } from '../../../data-tables/application/use-cases/list-data-tables.use-case';

export interface RunSqlAgentQueryInput {
  readonly companyId: string;
  readonly question: string;
}

export interface RunSqlAgentQueryResult {
  readonly rows: readonly DataTableRowEntity[];
}

/**
 * The SQL_AGENT arm of AskQuestionUseCase. Wraps DataTables' own
 * generate→execute pair (public application services per ROLE.md §7) so the
 * `ai` module never reaches into DataTables' repositories/infrastructure
 * directly. Re-resolves the company's data table independently rather than
 * trusting RouteQuestionUseCase's earlier check — same "verify again before
 * acting" pattern ExecuteSqlQueryUseCase itself already uses.
 *
 * Today picks the company's first data table; once a company can have
 * several, this is where picking the *right* one needs to be decided.
 */
@Injectable()
export class RunSqlAgentQueryUseCase {
  constructor(
    private readonly listDataTablesUseCase: ListDataTablesUseCase,
    private readonly generateSqlQueryUseCase: GenerateSqlQueryUseCase,
    private readonly executeSqlQueryUseCase: ExecuteSqlQueryUseCase,
  ) {}

  async execute(input: RunSqlAgentQueryInput): Promise<RunSqlAgentQueryResult | null> {
    const dataTables = await this.listDataTablesUseCase.execute({ companyId: input.companyId });
    const dataTable = dataTables[0];
    if (!dataTable) {
      return null;
    }

    const plan = await this.generateSqlQueryUseCase.execute({
      dataTableId: dataTable.id!,
      companyId: input.companyId,
      question: input.question,
    });

    const { rows } = await this.executeSqlQueryUseCase.execute({
      dataTableId: dataTable.id!,
      companyId: input.companyId,
      plan,
    });

    return { rows };
  }
}
