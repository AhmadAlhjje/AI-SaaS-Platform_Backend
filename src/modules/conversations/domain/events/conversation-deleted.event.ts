import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const CONVERSATION_DELETED_EVENT = 'conversation.deleted';

export class ConversationDeletedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly conversationId: string,
    public readonly companyId: string,
  ) {}
}
