import { Injectable } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';

@Injectable()
export class PrismaConversationRepository implements ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ConversationEntity | null> {
    const record = await this.prisma.conversation.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findAllByCompanyId(companyId: string): Promise<ConversationEntity[]> {
    const records = await this.prisma.conversation.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async create(conversation: ConversationEntity): Promise<ConversationEntity> {
    const record = await this.prisma.conversation.create({
      data: {
        companyId: conversation.companyId,
        title: conversation.title,
      },
    });

    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.conversation.delete({ where: { id } });
  }

  private toDomain(record: Conversation): ConversationEntity {
    return ConversationEntity.reconstitute({
      id: record.id,
      companyId: record.companyId,
      title: record.title,
      createdAt: record.createdAt,
    });
  }
}
