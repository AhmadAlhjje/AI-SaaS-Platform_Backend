import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';

export interface RenameConversationInput {
  readonly conversationId: string;
  readonly companyId: string;
  readonly title: string;
}

@Injectable()
export class RenameConversationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(input: RenameConversationInput): Promise<ConversationEntity> {
    const conversation = await this.conversationRepository.findById(input.conversationId);

    if (!conversation || conversation.companyId !== input.companyId) {
      throw new ConversationNotFoundError(input.conversationId);
    }

    return this.conversationRepository.updateTitle(conversation.id!, input.title);
  }
}
