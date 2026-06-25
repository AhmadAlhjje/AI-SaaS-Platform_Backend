import { Injectable } from '@nestjs/common';
import { Setting } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingRepository } from '../../domain/repositories/setting.repository';
import { Language } from '../../domain/value-objects/language.value-object';
import { Theme } from '../../domain/value-objects/theme.value-object';

@Injectable()
export class PrismaSettingRepository implements SettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCompanyId(companyId: string): Promise<SettingEntity | null> {
    const record = await this.prisma.setting.findUnique({ where: { companyId } });
    return record ? this.toDomain(record) : null;
  }

  async create(setting: SettingEntity): Promise<SettingEntity> {
    const record = await this.prisma.setting.create({
      data: {
        companyId: setting.companyId,
        theme: setting.theme,
        language: setting.language,
      },
    });

    return this.toDomain(record);
  }

  async update(setting: SettingEntity): Promise<SettingEntity> {
    const record = await this.prisma.setting.update({
      where: { id: setting.id! },
      data: {
        theme: setting.theme,
        language: setting.language,
      },
    });

    return this.toDomain(record);
  }

  private toDomain(record: Setting): SettingEntity {
    return SettingEntity.reconstitute({
      id: record.id,
      companyId: record.companyId,
      theme: record.theme as Theme,
      language: record.language as Language,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
