import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { DOCUMENT_UPLOADED_EVENT, DocumentUploadedEvent } from '../../../documents/domain/events/document-uploaded.event';
import { SUPPORTED_DATA_TABLE_FILE_TYPES } from '../../domain/value-objects/supported-file-type.value-object';
import { ImportDataTableJobData } from '../../infrastructure/jobs/job-data.types';

/**
 * Mirrors documents' EnqueueDocumentProcessingHandler — both listen to the
 * same DOCUMENT_UPLOADED_EVENT independently (ROLE.md §7: modules talk only
 * through domain events, not direct calls). PDFs go to RAG there; CSV/Excel
 * come here instead, for the Data Tables / SQL Agent pipeline.
 */
@Injectable()
export class EnqueueDataImportHandler {
  constructor(@InjectQueue(QUEUE_NAMES.IMPORT_DATA_TABLE) private readonly importQueue: Queue<ImportDataTableJobData>) {}

  @OnEvent(DOCUMENT_UPLOADED_EVENT)
  async handle(event: DocumentUploadedEvent): Promise<void> {
    if (!SUPPORTED_DATA_TABLE_FILE_TYPES.has(event.fileType)) {
      return;
    }

    await this.importQueue.add(QUEUE_NAMES.IMPORT_DATA_TABLE, {
      documentId: event.documentId,
      companyId: event.companyId,
      fileName: event.fileName,
      fileType: event.fileType,
      fileKey: event.fileUrl,
    });
  }
}
