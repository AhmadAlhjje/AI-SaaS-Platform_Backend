import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const DATA_IMPORT_FAILED_EVENT = 'data-table.import-failed';

export class DataImportFailedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: string,
    public readonly companyId: string,
  ) {}
}
