import { InvalidSchemaError } from '../errors/invalid-schema.error';
import { ColumnSchema } from '../value-objects/column-schema.value-object';

const TABLE_NAME_PATTERN = /^[a-z][a-z0-9_]{0,62}$/;

interface ReconstituteProps {
  readonly id: string;
  readonly companyId: string;
  readonly documentId: string;
  readonly tableName: string;
  readonly columns: readonly ColumnSchema[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * `tableName` is the whitelist key the SQL Agent resolves before running any
 * query (ROLE.md §12) — always generated here from the source file, never
 * accepted from a request body. Rows are stored as JSON (see
 * DataTableRowEntity), not a literal Postgres table, but the name is still
 * constrained to a safe identifier shape as defense in depth.
 */
export class DataTableEntity {
  private constructor(
    public readonly id: string | null,
    public readonly companyId: string,
    public readonly documentId: string,
    public readonly tableName: string,
    public readonly columns: readonly ColumnSchema[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static buildTableName(fileName: string, documentId: string): string {
    const base = fileName
      .toLowerCase()
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40);

    const suffix = documentId.replace(/-/g, '').slice(0, 8);
    const candidate = `${base || 'table'}_${suffix}`;

    return TABLE_NAME_PATTERN.test(candidate) ? candidate : `table_${suffix}`;
  }

  static create(companyId: string, documentId: string, tableName: string, columns: readonly ColumnSchema[]): DataTableEntity {
    if (columns.length === 0) {
      throw new InvalidSchemaError('Parsed table has no columns.');
    }

    const now = new Date();
    return new DataTableEntity(null, companyId, documentId, tableName, columns, now, now);
  }

  static reconstitute(props: ReconstituteProps): DataTableEntity {
    return new DataTableEntity(props.id, props.companyId, props.documentId, props.tableName, props.columns, props.createdAt, props.updatedAt);
  }

  hasColumn(columnName: string): boolean {
    return this.columns.some((column) => column.name === columnName);
  }
}
