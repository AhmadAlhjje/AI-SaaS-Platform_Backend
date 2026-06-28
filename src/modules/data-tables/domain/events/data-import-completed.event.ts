import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const DATA_IMPORT_COMPLETED_EVENT = 'data-table.import-completed';

export class DataImportCompletedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly dataTableId: string,
    public readonly companyId: string,
    public readonly documentId: string,
    public readonly rowCount: number,
  ) {}
}
