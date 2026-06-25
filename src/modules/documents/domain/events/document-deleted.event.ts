import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const DOCUMENT_DELETED_EVENT = 'document.deleted';

export class DocumentDeletedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: string,
    public readonly companyId: string,
  ) {}
}
