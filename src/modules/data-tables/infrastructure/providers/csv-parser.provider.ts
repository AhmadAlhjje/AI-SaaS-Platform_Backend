import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { InvalidSchemaError } from '../../domain/errors/invalid-schema.error';
import { ParsedTable, TableParser } from '../../domain/interfaces/table-parser.interface';
import { ColumnSchema } from '../../domain/value-objects/column-schema.value-object';
import { inferColumnType } from './infer-column-type';

@Injectable()
export class CsvParserProvider implements TableParser {
  async parse(buffer: Buffer): Promise<ParsedTable> {
    const records = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    if (records.length === 0) {
      throw new InvalidSchemaError('CSV file has no data rows.');
    }

    const headers = Object.keys(records[0]);
    if (headers.length === 0) {
      throw new InvalidSchemaError('CSV file has no columns.');
    }

    const columns: ColumnSchema[] = headers.map((name) => ({
      name,
      type: inferColumnType(records.map((row) => row[name])),
    }));

    return { columns, rows: records };
  }
}
