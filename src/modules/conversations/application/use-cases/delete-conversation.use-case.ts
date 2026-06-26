import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';
import { CONVERSATION_DELETED_EVENT, ConversationDeletedEvent } from '../../domain/events/conversation-deleted.event';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';

export interface DeleteConversationInput {
  readonly conversationId: string;
  readonly companyId: string;
}

@Injectable()
export class DeleteConversationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: DeleteConversationInput): Promise<void> {
    const conversation = await this.conversationRepository.findById(input.conversationId);

    if (!conversation || conversation.companyId !== input.companyId) {
      throw new ConversationNotFoundError(input.conversationId);
    }

    await this.conversationRepository.delete(conversation.id!);

    this.eventBus.publish(CONVERSATION_DELETED_EVENT, new ConversationDeletedEvent(conversation.id!, conversation.companyId));
  }
}
