import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { MessageEntity, SenderType } from '../../domain/entities/message.entity';
import { MessageRepository } from '../../domain/repositories/message.repository';

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByConversationId(conversationId: string): Promise<MessageEntity[]> {
    const records = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async create(message: MessageEntity): Promise<MessageEntity> {
    const record = await this.prisma.message.create({
      data: {
        companyId: message.companyId,
        conversationId: message.conversationId,
        senderType: message.senderType,
        content: message.content,
        modelUsed: message.usage?.modelUsed,
        promptTokens: message.usage?.promptTokens,
        completionTokens: message.usage?.completionTokens,
        totalTokens: message.usage?.totalTokens,
      },
    });

    return this.toDomain(record);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.message.delete({ where: { id } });
  }

  private toDomain(record: Message): MessageEntity {
    return MessageEntity.reconstitute({
      id: record.id,
      companyId: record.companyId,
      conversationId: record.conversationId,
      senderType: record.senderType as SenderType,
      content: record.content,
      usage:
        record.modelUsed !== null &&
        record.promptTokens !== null &&
        record.completionTokens !== null &&
        record.totalTokens !== null
          ? {
              modelUsed: record.modelUsed,
              promptTokens: record.promptTokens,
              completionTokens: record.completionTokens,
              totalTokens: record.totalTokens,
            }
          : null,
      createdAt: record.createdAt,
    });
  }
}
