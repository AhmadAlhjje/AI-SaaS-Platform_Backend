export type ColumnType = 'string' | 'number' | 'boolean' | 'date';

export interface ColumnSchema {
  readonly name: string;
  readonly type: ColumnType;
}
