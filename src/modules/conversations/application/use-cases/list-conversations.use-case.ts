import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';

export interface ListConversationsInput {
  readonly companyId: string;
}

@Injectable()
export class ListConversationsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepository,
  ) {}

  execute(input: ListConversationsInput): Promise<ConversationEntity[]> {
    return this.conversationRepository.findAllByCompanyId(input.companyId);
  }
}
