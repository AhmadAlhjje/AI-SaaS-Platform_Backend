import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { CONVERSATION_CREATED_EVENT, ConversationCreatedEvent } from '../../domain/events/conversation-created.event';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';

export interface CreateConversationInput {
  readonly companyId: string;
  readonly title?: string | null;
}

@Injectable()
export class CreateConversationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: CreateConversationInput): Promise<ConversationEntity> {
    const conversation = ConversationEntity.create(input.companyId, input.title ?? null);
    const createdConversation = await this.conversationRepository.create(conversation);

    this.eventBus.publish(
      CONVERSATION_CREATED_EVENT,
      new ConversationCreatedEvent(createdConversation.id!, createdConversation.companyId),
    );

    return createdConversation;
  }
}
