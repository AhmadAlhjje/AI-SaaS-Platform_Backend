import { Injectable } from '@nestjs/common';
import { ApiKey } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';

@Injectable()
export class PrismaApiKeyRepository implements ApiKeyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ApiKeyEntity | null> {
    const record = await this.prisma.apiKey.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findAllByCompanyId(companyId: string): Promise<ApiKeyEntity[]> {
    const records = await this.prisma.apiKey.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async create(apiKey: ApiKeyEntity): Promise<ApiKeyEntity> {
    const record = await this.prisma.apiKey.create({
      data: {
        companyId: apiKey.companyId,
        name: apiKey.name,
        keyHash: apiKey.keyHash,
      },
    });

    return this.toDomain(record);
  }

  async update(apiKey: ApiKeyEntity): Promise<ApiKeyEntity> {
    const record = await this.prisma.apiKey.update({
      where: { id: apiKey.id! },
      data: {
        name: apiKey.name,
        lastUsedAt: apiKey.lastUsedAt,
        revokedAt: apiKey.revokedAt,
      },
    });

    return this.toDomain(record);
  }

  private toDomain(record: ApiKey): ApiKeyEntity {
    return ApiKeyEntity.reconstitute({
      id: record.id,
      companyId: record.companyId,
      name: record.name,
      keyHash: record.keyHash,
      lastUsedAt: record.lastUsedAt,
      revokedAt: record.revokedAt,
      createdAt: record.createdAt,
    });
  }
}
