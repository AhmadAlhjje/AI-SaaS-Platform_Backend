import { Inject, Injectable } from '@nestjs/common';
import { AskQuestionUseCase } from '../../../ai/application/use-cases/ask-question.use-case';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { MessageEntity, SenderType } from '../../domain/entities/message.entity';
import { ConversationNotFoundError } from '../../domain/errors/conversation-not-found.error';
import { NoQuestionToRegenerateError } from '../../domain/errors/no-question-to-regenerate.error';
import { MESSAGE_SENT_EVENT, MessageSentEvent } from '../../domain/events/message-sent.event';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';

export interface RegenerateLastResponseInput {
  readonly conversationId: string;
  readonly companyId: string;
}

/**
 * Re-asks AskQuestionUseCase for the last user message — replacing the AI
 * reply it produced, if any — so the user gets a fresh answer to the same
 * question instead of a duplicate turn in the transcript.
 */
@Injectable()
export class RegenerateLastResponseUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepository,
    @Inject(REPOSITORY_TOKENS.MESSAGE_REPOSITORY) private readonly messageRepository: MessageRepository,
    private readonly eventBus: EventBus,
    private readonly askQuestionUseCase: AskQuestionUseCase,
  ) {}

  async execute(input: RegenerateLastResponseInput): Promise<MessageEntity> {
    const conversation = await this.conversationRepository.findById(input.conversationId);

    if (!conversation || conversation.companyId !== input.companyId) {
      throw new ConversationNotFoundError(input.conversationId);
    }

    const messages = await this.messageRepository.findAllByConversationId(input.conversationId);
    const lastUserMessage = [...messages].reverse().find((message) => message.senderType === SenderType.USER);

    if (!lastUserMessage) {
      throw new NoQuestionToRegenerateError(input.conversationId);
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.senderType === SenderType.AI) {
      await this.messageRepository.deleteById(lastMessage.id!);
    }

    const answer = await this.askQuestionUseCase.execute({
      companyId: input.companyId,
      question: lastUserMessage.content,
    });

    const aiMessage = MessageEntity.create(input.companyId, input.conversationId, SenderType.AI, answer.content, {
      modelUsed: answer.modelUsed,
      promptTokens: answer.promptTokens,
      completionTokens: answer.completionTokens,
      totalTokens: answer.totalTokens,
    });

    const createdMessage = await this.messageRepository.create(aiMessage);

    this.eventBus.publish(
      MESSAGE_SENT_EVENT,
      new MessageSentEvent(createdMessage.id!, createdMessage.conversationId, createdMessage.companyId, createdMessage.senderType),
    );

    return createdMessage;
  }
}
