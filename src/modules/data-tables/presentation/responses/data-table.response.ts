import { DataTableEntity } from '../../domain/entities/data-table.entity';

export class DataTableResponse {
  readonly id: string;
  readonly documentId: string;
  readonly tableName: string;
  readonly columns: { name: string; type: string }[];
  readonly createdAt: Date;

  constructor(dataTable: DataTableEntity) {
    this.id = dataTable.id!;
    this.documentId = dataTable.documentId;
    this.tableName = dataTable.tableName;
    this.columns = dataTable.columns.map((column) => ({ name: column.name, type: column.type }));
    this.createdAt = dataTable.createdAt;
  }
}

export class DataTableDetailResponse extends DataTableResponse {
  readonly rowCount: number;

  constructor(dataTable: DataTableEntity, rowCount: number) {
    super(dataTable);
    this.rowCount = rowCount;
  }
}
