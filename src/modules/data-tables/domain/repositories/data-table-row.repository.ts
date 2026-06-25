import { DataTableRowEntity } from '../entities/data-table-row.entity';
import { QueryPlan } from '../interfaces/sql-query-generator.interface';

export interface DataTableRowRepository {
  /** Runs a QueryPlan as parameterized Prisma JSON-path filters — never raw SQL. */
  query(dataTableId: string, plan: QueryPlan): Promise<DataTableRowEntity[]>;
  countByDataTableId(dataTableId: string): Promise<number>;
}
