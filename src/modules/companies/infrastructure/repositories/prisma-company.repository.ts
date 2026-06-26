import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { CompanyStatus } from '../../domain/value-objects/company-status.value-object';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CompanyEntity | null> {
    const record = await this.prisma.company.findFirst({ where: { id, deletedAt: null } });
    return record ? this.toDomain(record) : null;
  }

  async findByUserId(userId: string): Promise<CompanyEntity | null> {
    const record = await this.prisma.company.findFirst({ where: { userId, deletedAt: null } });
    return record ? this.toDomain(record) : null;
  }

  async create(company: CompanyEntity): Promise<CompanyEntity> {
    const record = await this.prisma.company.create({
      data: {
        userId: company.userId,
        name: company.name,
        logo: company.logo,
      },
    });

    return this.toDomain(record);
  }

  async update(company: CompanyEntity): Promise<CompanyEntity> {
    const record = await this.prisma.company.update({
      where: { id: company.id! },
      data: {
        name: company.name,
        logo: company.logo,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
        address: company.address,
        website: company.website,
        status: company.status,
      },
    });

    return this.toDomain(record);
  }

  private toDomain(record: Company): CompanyEntity {
    return CompanyEntity.reconstitute({
      id: record.id,
      userId: record.userId,
      name: record.name,
      logo: record.logo,
      contactEmail: record.contactEmail,
      contactPhone: record.contactPhone,
      address: record.address,
      website: record.website,
      status: record.status as CompanyStatus,
      createdAt: record.createdAt,
    });
  }
}
