import { ColumnType } from '../../domain/value-objects/column-schema.value-object';

const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

/** Shared by CsvParserProvider and ExcelParserProvider — inferred from the first non-empty sample value in the column. */
export function inferColumnType(values: readonly unknown[]): ColumnType {
  const sample = values.find((value) => value !== null && value !== undefined && value !== '');

  if (sample === undefined) {
    return 'string';
  }

  if (typeof sample === 'boolean') {
    return 'boolean';
  }

  if (typeof sample === 'number') {
    return 'number';
  }

  if (typeof sample === 'string' && NUMBER_PATTERN.test(sample)) {
    return 'number';
  }

  if (sample instanceof Date || (typeof sample === 'string' && DATE_PATTERN.test(sample) && !Number.isNaN(Date.parse(sample)))) {
    return 'date';
  }

  return 'string';
}
