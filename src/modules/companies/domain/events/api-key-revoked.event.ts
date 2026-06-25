import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const API_KEY_REVOKED_EVENT = 'api-key.revoked';

export class ApiKeyRevokedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly apiKeyId: string,
    public readonly companyId: string,
  ) {}
}
