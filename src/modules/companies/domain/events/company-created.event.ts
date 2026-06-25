import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const COMPANY_CREATED_EVENT = 'company.created';

export class CompanyCreatedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly companyId: string,
    public readonly userId: string,
  ) {}
}
