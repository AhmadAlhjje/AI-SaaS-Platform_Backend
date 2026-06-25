import { DomainError } from '../../../../shared/exceptions/domain.error';

export class ConversationNotFoundError extends DomainError {
  readonly code = 'CONVERSATION_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(conversationId: string) {
    super(`Conversation ${conversationId} was not found.`);
  }
}
