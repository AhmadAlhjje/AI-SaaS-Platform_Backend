import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const DATA_TABLE_CREATED_EVENT = 'data-table.created';

export class DataTableCreatedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly dataTableId: string,
    public readonly companyId: string,
    public readonly documentId: string,
    public readonly tableName: string,
  ) {}
}
