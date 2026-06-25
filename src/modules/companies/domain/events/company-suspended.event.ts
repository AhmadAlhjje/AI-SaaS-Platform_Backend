import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const COMPANY_SUSPENDED_EVENT = 'company.suspended';

export class CompanySuspendedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(public readonly companyId: string) {}
}
