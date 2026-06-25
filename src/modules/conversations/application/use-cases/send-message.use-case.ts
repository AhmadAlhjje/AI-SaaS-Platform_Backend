import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { MessageEntity, MessageUsage, SenderType } from '../../domain/entities/message.entity';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';
import { MESSAGE_SENT_EVENT, MessageSentEvent } from '../../domain/events/message-sent.event';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';

export interface SendMessageInput {
  readonly companyId: string;
  readonly conversationId: string;
  readonly senderType: SenderType;
  readonly content: string;
  readonly usage?: MessageUsage;
}

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepository,
    @Inject(REPOSITORY_TOKENS.MESSAGE_REPOSITORY) private readonly messageRepository: MessageRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: SendMessageInput): Promise<MessageEntity> {
    const conversation = await this.conversationRepository.findById(input.conversationId);

    // Ownership check (ROLE.md §10.4): a conversation belonging to another
    // company must look identical to one that doesn't exist at all.
    if (!conversation || conversation.companyId !== input.companyId) {
      throw new ConversationNotFoundError(input.conversationId);
    }

    const message = MessageEntity.create(
      input.companyId,
      input.conversationId,
      input.senderType,
      input.content,
      input.usage ?? null,
    );
    const createdMessage = await this.messageRepository.create(message);

    this.eventBus.publish(
      MESSAGE_SENT_EVENT,
      new MessageSentEvent(createdMessage.id!, createdMessage.conversationId, createdMessage.companyId, createdMessage.senderType),
    );

    return createdMessage;
  }
}
