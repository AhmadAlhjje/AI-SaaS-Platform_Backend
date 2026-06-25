import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { DataTableEntity } from '../../domain/entities/data-table.entity';
import { DATA_IMPORT_COMPLETED_EVENT, DataImportCompletedEvent } from '../../domain/events/data-import-completed.event';
import { DATA_TABLE_CREATED_EVENT, DataTableCreatedEvent } from '../../domain/events/data-table-created.event';
import { TableParser } from '../../domain/interfaces/table-parser.interface';
import { DataTableRepository } from '../../domain/repositories/data-table.repository';
import { EXCEL_FILE_TYPES } from '../../domain/value-objects/supported-file-type.value-object';

export interface ImportDataTableInput {
  readonly companyId: string;
  readonly documentId: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly buffer: Buffer;
}

/**
 * Triggered by EnqueueDataImportHandler via the IMPORT_DATA_TABLE queue
 * (ROLE.md §13: "Data Import" is a listed heavy operation) — never called
 * inline from an HTTP request. The same /documents upload endpoint accepts
 * CSV/Excel files; routing into RAG vs this pipeline happens purely through
 * the DocumentUploadedEvent each module listens to independently.
 */
@Injectable()
export class ImportDataTableUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY) private readonly dataTableRepository: DataTableRepository,
    @Inject(PROVIDER_TOKENS.CSV_PARSER) private readonly csvParser: TableParser,
    @Inject(PROVIDER_TOKENS.EXCEL_PARSER) private readonly excelParser: TableParser,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: ImportDataTableInput): Promise<DataTableEntity> {
    const parser = EXCEL_FILE_TYPES.has(input.fileType) ? this.excelParser : this.csvParser;
    const parsed = await parser.parse(input.buffer);

    const tableName = DataTableEntity.buildTableName(input.fileName, input.documentId);
    const dataTable = DataTableEntity.create(input.companyId, input.documentId, tableName, parsed.columns);
    const createdDataTable = await this.dataTableRepository.createWithRows(dataTable, parsed.rows);

    this.eventBus.publish(
      DATA_TABLE_CREATED_EVENT,
      new DataTableCreatedEvent(createdDataTable.id!, createdDataTable.companyId, createdDataTable.documentId, createdDataTable.tableName),
    );
    this.eventBus.publish(
      DATA_IMPORT_COMPLETED_EVENT,
      new DataImportCompletedEvent(createdDataTable.id!, createdDataTable.companyId, parsed.rows.length),
    );

    return createdDataTable;
  }
}
