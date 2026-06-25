import { SenderType } from '../entities/message.entity';
import { DomainEvent } from '../../../../shared/events/domain-event.interface';

export const MESSAGE_SENT_EVENT = 'message.sent';

export class MessageSentEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly messageId: string,
    public readonly conversationId: string,
    public readonly companyId: string,
    public readonly senderType: SenderType,
  ) {}
}
