import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const DOCUMENT_UPLOADED_EVENT = 'document.uploaded';

export class DocumentUploadedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: string,
    public readonly companyId: string,
    public readonly fileType: string,
    public readonly fileUrl: string,
    public readonly fileName: string,
  ) {}
}
