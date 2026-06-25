import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const CONVERSATION_CREATED_EVENT = 'conversation.created';

export class ConversationCreatedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly conversationId: string,
    public readonly companyId: string,
  ) {}
}
