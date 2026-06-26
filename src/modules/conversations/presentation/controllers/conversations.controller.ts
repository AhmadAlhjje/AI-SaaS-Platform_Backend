import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { CreateConversationUseCase } from '../../application/use-cases/create-conversation.use-case';
import { DeleteConversationUseCase } from '../../application/use-cases/delete-conversation.use-case';
import { GetConversationHistoryUseCase } from '../../application/use-cases/get-conversation-history.use-case';
import { ListConversationsUseCase } from '../../application/use-cases/list-conversations.use-case';
import { RegenerateLastResponseUseCase } from '../../application/use-cases/regenerate-last-response.use-case';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';
import { SenderType } from '../../domain/entities/message.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { ConversationResponse } from '../responses/conversation.response';
import { MessageResponse } from '../responses/message.response';
import { SendMessageResponse } from '../responses/send-message.response';

@Controller('conversations')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class ConversationsController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly listConversationsUseCase: ListConversationsUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getConversationHistoryUseCase: GetConversationHistoryUseCase,
    private readonly deleteConversationUseCase: DeleteConversationUseCase,
    private readonly regenerateLastResponseUseCase: RegenerateLastResponseUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentCompany() companyId: string,
    @Body() dto: CreateConversationDto,
  ): Promise<ConversationResponse> {
    const conversation = await this.createConversationUseCase.execute({ companyId, title: dto.title });
    return new ConversationResponse(conversation);
  }

  @Get()
  async list(@CurrentCompany() companyId: string): Promise<ConversationResponse[]> {
    const conversations = await this.listConversationsUseCase.execute({ companyId });
    return conversations.map((conversation) => new ConversationResponse(conversation));
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @CurrentCompany() companyId: string,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ): Promise<SendMessageResponse> {
    const { userMessage, aiMessage } = await this.sendMessageUseCase.execute({
      companyId,
      conversationId,
      senderType: SenderType.USER,
      content: dto.content,
    });

    return new SendMessageResponse(userMessage, aiMessage);
  }

  @Get(':id/messages')
  async getMessages(
    @CurrentCompany() companyId: string,
    @Param('id') conversationId: string,
  ): Promise<MessageResponse[]> {
    const messages = await this.getConversationHistoryUseCase.execute({ companyId, conversationId });
    return messages.map((message) => new MessageResponse(message));
  }

  @Post(':id/messages/regenerate')
  async regenerate(
    @CurrentCompany() companyId: string,
    @Param('id') conversationId: string,
  ): Promise<MessageResponse> {
    const aiMessage = await this.regenerateLastResponseUseCase.execute({ companyId, conversationId });
    return new MessageResponse(aiMessage);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentCompany() companyId: string, @Param('id') conversationId: string): Promise<void> {
    await this.deleteConversationUseCase.execute({ conversationId, companyId });
  }
}
