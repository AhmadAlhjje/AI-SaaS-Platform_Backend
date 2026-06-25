import { Injectable } from '@nestjs/common';
import { AiConfiguration } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { AiConfigurationEntity } from '../../domain/entities/ai-configuration.entity';
import { AiConfigurationRepository } from '../../domain/repositories/ai-configuration.repository';

@Injectable()
export class PrismaAiConfigurationRepository implements AiConfigurationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCompanyId(companyId: string): Promise<AiConfigurationEntity | null> {
    const record = await this.prisma.aiConfiguration.findUnique({ where: { companyId } });
    return record ? this.toDomain(record) : null;
  }

  async create(config: AiConfigurationEntity): Promise<AiConfigurationEntity> {
    const record = await this.prisma.aiConfiguration.create({
      data: {
        companyId: config.companyId,
        systemPrompt: config.systemPrompt,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        ragTopK: config.ragTopK,
      },
    });

    return this.toDomain(record);
  }

  async update(config: AiConfigurationEntity): Promise<AiConfigurationEntity> {
    const record = await this.prisma.aiConfiguration.update({
      where: { id: config.id! },
      data: {
        systemPrompt: config.systemPrompt,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        ragTopK: config.ragTopK,
      },
    });

    return this.toDomain(record);
  }

  private toDomain(record: AiConfiguration): AiConfigurationEntity {
    return AiConfigurationEntity.reconstitute({
      id: record.id,
      companyId: record.companyId,
      systemPrompt: record.systemPrompt,
      model: record.model,
      temperature: record.temperature,
      maxTokens: record.maxTokens,
      ragTopK: record.ragTopK,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
