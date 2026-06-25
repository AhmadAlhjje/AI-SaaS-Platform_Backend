import { DataTableEntity } from '../entities/data-table.entity';

export interface DataTableRepository {
  findById(id: string): Promise<DataTableEntity | null>;
  findAllByCompanyId(companyId: string): Promise<DataTableEntity[]>;
  /** Creates the table metadata and its parsed rows in a single transaction. */
  createWithRows(dataTable: DataTableEntity, rows: readonly Record<string, unknown>[]): Promise<DataTableEntity>;
}
