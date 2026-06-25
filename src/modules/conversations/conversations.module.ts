import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { CreateConversationUseCase } from './application/use-cases/create-conversation.use-case';
import { GetConversationHistoryUseCase } from './application/use-cases/get-conversation-history.use-case';
import { ListConversationsUseCase } from './application/use-cases/list-conversations.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { PrismaConversationRepository } from './infrastructure/repositories/prisma-conversation.repository';
import { PrismaMessageRepository } from './infrastructure/repositories/prisma-message.repository';
import { ConversationsController } from './presentation/controllers/conversations.controller';

@Module({
  imports: [AiModule],
  controllers: [ConversationsController],
  providers: [
    CreateConversationUseCase,
    ListConversationsUseCase,
    SendMessageUseCase,
    GetConversationHistoryUseCase,
    { provide: REPOSITORY_TOKENS.CONVERSATION_REPOSITORY, useClass: PrismaConversationRepository },
    { provide: REPOSITORY_TOKENS.MESSAGE_REPOSITORY, useClass: PrismaMessageRepository },
  ],
})
export class ConversationsModule {}
