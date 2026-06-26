import { Injectable } from '@nestjs/common';
import { Document } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { DocumentRepository, FindAllByCompanyIdOptions } from '../../domain/repositories/document.repository';
import { DocumentStatus } from '../../domain/value-objects/document-status.value-object';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<DocumentEntity | null> {
    const record = await this.prisma.document.findFirst({ where: { id, deletedAt: null } });
    return record ? this.toDomain(record) : null;
  }

  async findAllByCompanyId(companyId: string, options: FindAllByCompanyIdOptions): Promise<DocumentEntity[]> {
    const records = await this.prisma.document.findMany({
      where: {
        companyId,
        deletedAt: null,
        ...(options.search ? { fileName: { contains: options.search, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip: options.skip,
      take: options.take,
    });

    return records.map((record) => this.toDomain(record));
  }

  async countByCompanyId(companyId: string, search?: string): Promise<number> {
    return this.prisma.document.count({
      where: {
        companyId,
        deletedAt: null,
        ...(search ? { fileName: { contains: search, mode: 'insensitive' } } : {}),
      },
    });
  }

  async countByCompanyIdExcludingFileType(companyId: string, excludedFileType: string): Promise<number> {
    return this.prisma.document.count({
      where: { companyId, deletedAt: null, fileType: { not: excludedFileType } },
    });
  }

  async create(document: DocumentEntity): Promise<DocumentEntity> {
    const record = await this.prisma.document.create({
      data: {
        companyId: document.companyId,
        fileName: document.fileName,
        fileType: document.fileType,
        fileUrl: document.fileUrl,
        knowledgeType: document.knowledgeType,
        status: document.status,
      },
    });

    return this.toDomain(record);
  }

  async updateStatus(id: string, status: DocumentStatus): Promise<void> {
    await this.prisma.document.update({ where: { id }, data: { status } });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.document.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  private toDomain(record: Document): DocumentEntity {
    return DocumentEntity.reconstitute({
      id: record.id,
      companyId: record.companyId,
      fileName: record.fileName,
      fileType: record.fileType,
      fileUrl: record.fileUrl,
      knowledgeType: record.knowledgeType,
      status: record.status as DocumentStatus,
      createdAt: record.createdAt,
    });
  }
}
