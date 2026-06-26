import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { toPrismaSkipTake } from '../../../../shared/utils/pagination.util';
import { DataTableRowEntity } from '../../domain/entities/data-table-row.entity';
import { DataTableNotFoundError } from '../../domain/errors/data-table-not-found.error';
import { InvalidQueryError } from '../../domain/errors/invalid-query.error';
import { QueryFilter } from '../../domain/interfaces/sql-query-generator.interface';
import { DataTableRepository } from '../../domain/repositories/data-table.repository';
import { DataTableRowRepository } from '../../domain/repositories/data-table-row.repository';

export interface GetDataTableRowsInput {
  readonly dataTableId: string;
  readonly companyId: string;
  readonly search?: string;
  readonly filters: readonly QueryFilter[];
  readonly page?: number;
  readonly limit?: number;
}

export interface GetDataTableRowsResult {
  readonly items: DataTableRowEntity[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

/** Filter columns are validated against the table's own schema before touching Prisma (ROLE.md §12). */
@Injectable()
export class GetDataTableRowsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY) private readonly dataTableRepository: DataTableRepository,
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_ROW_REPOSITORY) private readonly dataTableRowRepository: DataTableRowRepository,
  ) {}

  async execute(input: GetDataTableRowsInput): Promise<GetDataTableRowsResult> {
    const dataTable = await this.dataTableRepository.findById(input.dataTableId);

    if (!dataTable || dataTable.companyId !== input.companyId) {
      throw new DataTableNotFoundError(input.dataTableId);
    }

    for (const filter of input.filters) {
      if (!dataTable.hasColumn(filter.column)) {
        throw new InvalidQueryError(`Unknown column "${filter.column}" for this data table.`);
      }
    }

    const searchableColumns = dataTable.columns.filter((column) => column.type === 'string').map((column) => column.name);
    const { skip, take, page, limit } = toPrismaSkipTake({ page: input.page, limit: input.limit });

    const queryOptions = { filters: input.filters, search: input.search, searchableColumns };

    const [items, total] = await Promise.all([
      this.dataTableRowRepository.findPaginated(dataTable.id!, { ...queryOptions, skip, take }),
      this.dataTableRowRepository.countFiltered(dataTable.id!, queryOptions),
    ]);

    return { items, total, page, limit };
  }
}
