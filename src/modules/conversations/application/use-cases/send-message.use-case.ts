import { Inject, Injectable } from '@nestjs/common';
import { AskQuestionUseCase } from '../../../ai/application/use-cases/ask-question.use-case';
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

export interface SendMessageResult {
  readonly userMessage: MessageEntity;
  readonly aiMessage: MessageEntity | null;
}

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.CONVERSATION_REPOSITORY) private readonly conversationRepository: ConversationRepository,
    @Inject(REPOSITORY_TOKENS.MESSAGE_REPOSITORY) private readonly messageRepository: MessageRepository,
    private readonly eventBus: EventBus,
    private readonly askQuestionUseCase: AskQuestionUseCase,
  ) {}

  async execute(input: SendMessageInput): Promise<SendMessageResult> {
    const conversation = await this.conversationRepository.findById(input.conversationId);

    // Ownership check (ROLE.md §10.4): a conversation belonging to another
    // company must look identical to one that doesn't exist at all.
    if (!conversation || conversation.companyId !== input.companyId) {
      throw new ConversationNotFoundError(input.conversationId);
    }

    const userMessage = await this.persistMessage(input.companyId, input.conversationId, input.senderType, input.content, input.usage);

    // Only a user message triggers an AI reply — prevents the AI's own
    // reply (senderType AI) from recursively asking another question.
    if (input.senderType !== SenderType.USER) {
      return { userMessage, aiMessage: null };
    }

    const answer = await this.askQuestionUseCase.execute({
      companyId: input.companyId,
      question: input.content,
    });

    const aiMessage = await this.persistMessage(input.companyId, input.conversationId, SenderType.AI, answer.content, {
      modelUsed: answer.modelUsed,
      promptTokens: answer.promptTokens,
      completionTokens: answer.completionTokens,
      totalTokens: answer.totalTokens,
    });

    return { userMessage, aiMessage };
  }

  private async persistMessage(
    companyId: string,
    conversationId: string,
    senderType: SenderType,
    content: string,
    usage?: MessageUsage,
  ): Promise<MessageEntity> {
    const message = MessageEntity.create(companyId, conversationId, senderType, content, usage ?? null);
    const createdMessage = await this.messageRepository.create(message);

    this.eventBus.publish(
      MESSAGE_SENT_EVENT,
      new MessageSentEvent(createdMessage.id!, createdMessage.conversationId, createdMessage.companyId, createdMessage.senderType),
    );

    return createdMessage;
  }
}
