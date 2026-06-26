import { DataTableRowEntity } from '../entities/data-table-row.entity';
import { QueryFilter, QueryPlan } from '../interfaces/sql-query-generator.interface';

export interface RowQueryOptions {
  readonly filters: readonly QueryFilter[];
  readonly search?: string;
  readonly searchableColumns: readonly string[];
  readonly skip: number;
  readonly take: number;
}

export interface DataTableRowRepository {
  /** Runs a QueryPlan as parameterized Prisma JSON-path filters — never raw SQL. */
  query(dataTableId: string, plan: QueryPlan): Promise<DataTableRowEntity[]>;
  countByDataTableId(dataTableId: string): Promise<number>;
  findPaginated(dataTableId: string, options: RowQueryOptions): Promise<DataTableRowEntity[]>;
  countFiltered(dataTableId: string, options: Omit<RowQueryOptions, 'skip' | 'take'>): Promise<number>;
}
