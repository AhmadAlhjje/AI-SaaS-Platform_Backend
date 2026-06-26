import { GetDataTableRowsResult } from '../../application/use-cases/get-data-table-rows.use-case';

export class PaginatedDataTableRowsResponse {
  readonly items: Record<string, unknown>[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;

  constructor(result: GetDataTableRowsResult) {
    this.items = result.items.map((row) => row.rowData);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }
}
