import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { DataTableEntity } from '../../domain/entities/data-table.entity';
import { DataTableRowEntity } from '../../domain/entities/data-table-row.entity';
import { DataTableNotFoundError } from '../../domain/errors/data-table-not-found.error';
import { InvalidQueryError } from '../../domain/errors/invalid-query.error';
import { QueryPlan } from '../../domain/interfaces/sql-query-generator.interface';
import { DataTableRepository } from '../../domain/repositories/data-table.repository';
import { DataTableRowRepository } from '../../domain/repositories/data-table-row.repository';

const MAX_LIMIT = 100;

export interface ExecuteSqlQueryInput {
  readonly dataTableId: string;
  readonly companyId: string;
  readonly plan: QueryPlan;
}

export interface ExecuteSqlQueryResult {
  readonly dataTable: DataTableEntity;
  readonly rows: DataTableRowEntity[];
}

/**
 * Only ever runs a QueryPlan whose filter columns have been validated
 * against this table's own schema — any unknown column is rejected before
 * touching Prisma. Combined with the repository's parameterized JSON-path
 * filters (never a string-built query), this is how ROLE.md §12's
 * "whitelisted table names, no string-built SQL" rule is actually enforced
 * for the EAV (schema_json + row_data JSON) storage model this project uses.
 */
@Injectable()
export class ExecuteSqlQueryUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY) private readonly dataTableRepository: DataTableRepository,
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_ROW_REPOSITORY) private readonly dataTableRowRepository: DataTableRowRepository,
  ) {}

  async execute(input: ExecuteSqlQueryInput): Promise<ExecuteSqlQueryResult> {
    const dataTable = await this.dataTableRepository.findById(input.dataTableId);

    if (!dataTable || dataTable.companyId !== input.companyId) {
      throw new DataTableNotFoundError(input.dataTableId);
    }

    for (const filter of input.plan.filters) {
      if (!dataTable.hasColumn(filter.column)) {
        throw new InvalidQueryError(`Unknown column "${filter.column}" for this data table.`);
      }
    }

    const safePlan: QueryPlan = { filters: input.plan.filters, limit: Math.min(input.plan.limit, MAX_LIMIT) };
    const rows = await this.dataTableRowRepository.query(dataTable.id!, safePlan);

    return { dataTable, rows };
  }
}
