import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { InvalidSchemaError } from '../../domain/errors/invalid-schema.error';
import { ParsedTable, TableParser } from '../../domain/interfaces/table-parser.interface';
import { ColumnSchema } from '../../domain/value-objects/column-schema.value-object';
import { inferColumnType } from './infer-column-type';

@Injectable()
export class ExcelParserProvider implements TableParser {
  async parse(buffer: Buffer): Promise<ParsedTable> {
    const workbook = new ExcelJS.Workbook();
    // exceljs ships its own @types/node version pin, which TS sees as a
    // structurally-incompatible Buffer type from this project's — same
    // runtime type, different type identity.
    await workbook.xlsx.load(buffer as unknown as ArrayBuffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new InvalidSchemaError('Excel file has no sheets.');
    }

    const headers: string[] = [];
    worksheet.getRow(1).eachCell({ includeEmpty: false }, (cell) => {
      headers.push(String(cell.value ?? '').trim());
    });

    if (headers.length === 0) {
      throw new InvalidSchemaError('Excel sheet has no columns.');
    }

    const records: Record<string, unknown>[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      const record: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        record[header] = row.getCell(index + 1).value ?? null;
      });
      records.push(record);
    });

    if (records.length === 0) {
      throw new InvalidSchemaError('Excel sheet has no data rows.');
    }

    const columns: ColumnSchema[] = headers.map((name) => ({
      name,
      type: inferColumnType(records.map((row) => row[name])),
    }));

    return { columns, rows: records };
  }
}
