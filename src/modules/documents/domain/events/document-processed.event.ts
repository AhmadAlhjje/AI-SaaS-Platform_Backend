import { DomainEvent } from '../../../../shared/events/domain-event.interface';
import { DocumentStatus } from '../value-objects/document-status.value-object';

export const DOCUMENT_PROCESSED_EVENT = 'document.processed';

export class DocumentProcessedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: string,
    public readonly companyId: string,
    public readonly status: DocumentStatus.READY | DocumentStatus.FAILED,
  ) {}
}
