import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import {
  DATA_IMPORT_COMPLETED_EVENT,
  DataImportCompletedEvent,
} from '../../../data-tables/domain/events/data-import-completed.event';
import { DATA_IMPORT_FAILED_EVENT, DataImportFailedEvent } from '../../../data-tables/domain/events/data-import-failed.event';
import { DOCUMENT_PROCESSED_EVENT, DocumentProcessedEvent } from '../../domain/events/document-processed.event';
import { DocumentRepository } from '../../domain/repositories/document.repository';
import { DocumentStatus } from '../../domain/value-objects/document-status.value-object';

/**
 * Mirrors the RAG pipeline's own status updates (IndexToQdrantJob /
 * DocumentProcessingFailureHandler), but for the parallel CSV/Excel →
 * Data Table import pipeline, which never touched Document.status before.
 * Lives in Documents (not Data Tables) so only this module's own
 * repository is written to, per the cross-module event convention.
 */
@Injectable()
export class SyncDataImportStatusHandler {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
    private readonly eventBus: EventBus,
  ) {}

  @OnEvent(DATA_IMPORT_COMPLETED_EVENT)
  async handleCompleted(event: DataImportCompletedEvent): Promise<void> {
    await this.documentRepository.updateStatus(event.documentId, DocumentStatus.READY);
    this.eventBus.publish(
      DOCUMENT_PROCESSED_EVENT,
      new DocumentProcessedEvent(event.documentId, event.companyId, DocumentStatus.READY),
    );
  }

  @OnEvent(DATA_IMPORT_FAILED_EVENT)
  async handleFailed(event: DataImportFailedEvent): Promise<void> {
    await this.documentRepository.updateStatus(event.documentId, DocumentStatus.FAILED);
    this.eventBus.publish(
      DOCUMENT_PROCESSED_EVENT,
      new DocumentProcessedEvent(event.documentId, event.companyId, DocumentStatus.FAILED),
    );
  }
}
