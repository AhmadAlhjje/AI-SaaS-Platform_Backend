// PDF goes through documents' RAG pipeline instead — see PDF_FILE_TYPE in
// documents/domain/entities/document.entity.ts.
export const CSV_FILE_TYPE = 'text/csv';

export const EXCEL_FILE_TYPES = new Set<string>([
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export const SUPPORTED_DATA_TABLE_FILE_TYPES = new Set<string>([CSV_FILE_TYPE, ...EXCEL_FILE_TYPES]);
