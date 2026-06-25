import { ColumnSchema } from '../value-objects/column-schema.value-object';

export interface ParsedTable {
  readonly columns: readonly ColumnSchema[];
  readonly rows: readonly Record<string, unknown>[];
}

/** Implemented by CsvParserProvider / ExcelParserProvider in infrastructure. */
export interface TableParser {
  parse(buffer: Buffer): Promise<ParsedTable>;
}
