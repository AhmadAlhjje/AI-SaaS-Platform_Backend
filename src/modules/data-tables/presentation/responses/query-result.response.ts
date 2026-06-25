import { ExecuteSqlQueryResult } from '../../application/use-cases/execute-sql-query.use-case';

export class QueryResultResponse {
  readonly tableName: string;
  readonly rows: Record<string, unknown>[];

  constructor(result: ExecuteSqlQueryResult) {
    this.tableName = result.dataTable.tableName;
    this.rows = result.rows.map((row) => row.rowData);
  }
}
