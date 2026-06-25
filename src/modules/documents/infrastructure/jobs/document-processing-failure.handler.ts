import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { DOCUMENT_PROCESSED_EVENT, DocumentProcessedEvent } from '../../domain/events/document-processed.event';
import { DocumentRepository } from '../../domain/repositories/document.repository';
import { DocumentStatus } from '../../domain/value-objects/document-status.value-object';

/**
 * Shared by every stage of the RAG pipeline (ParsePdfJob → IndexToQdrantJob):
 * on any failure, mark the document failed and notify, then the caller
 * rethrows so BullMQ records the job as failed too.
 */
@Injectable()
export class DocumentProcessingFailureHandler {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
    private readonly eventBus: EventBus,
  ) {}

  async handle(documentId: string, companyId: string): Promise<void> {
    await this.documentRepository.updateStatus(documentId, DocumentStatus.FAILED);
    this.eventBus.publish(DOCUMENT_PROCESSED_EVENT, new DocumentProcessedEvent(documentId, companyId, DocumentStatus.FAILED));
  }
}
