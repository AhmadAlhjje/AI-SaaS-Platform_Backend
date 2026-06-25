import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { MessageEntity } from '../../domain/entities/message.entity';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';

export interface GetConversationHistoryInput {
  readonly companyId: string;
  readonly conversationId: string;
}

@Injectable()
export class GetConversationHistoryUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepository,
    @Inject(REPOSITORY_TOKENS.MESSAGE_REPOSITORY) private readonly messageRepository: MessageRepository,
  ) {}

  async execute(input: GetConversationHistoryInput): Promise<MessageEntity[]> {
    const conversation = await this.conversationRepository.findById(input.conversationId);

    if (!conversation || conversation.companyId !== input.companyId) {
      throw new ConversationNotFoundError(input.conversationId);
    }

    return this.messageRepository.findAllByConversationId(input.conversationId);
  }
}
