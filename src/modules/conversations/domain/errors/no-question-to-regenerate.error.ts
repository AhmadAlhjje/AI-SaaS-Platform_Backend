import { DomainError } from '../../../../shared/exceptions/domain.error';

export class NoQuestionToRegenerateError extends DomainError {
  readonly code = 'NO_QUESTION_TO_REGENERATE';
  readonly httpStatus = 422;

  constructor(conversationId: string) {
    super(`Conversation ${conversationId} has no user message to regenerate a reply for.`);
  }
}
