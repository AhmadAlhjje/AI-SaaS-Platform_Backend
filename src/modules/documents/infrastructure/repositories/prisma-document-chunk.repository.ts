import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { DocumentChunkEntity } from '../../domain/entities/document-chunk.entity';
import { DocumentChunkRepository } from '../../domain/repositories/document-chunk.repository';

@Injectable()
export class PrismaDocumentChunkRepository implements DocumentChunkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(chunks: readonly DocumentChunkEntity[]): Promise<void> {
    if (chunks.length === 0) {
      return;
    }

    await this.prisma.documentChunk.createMany({
      data: chunks.map((chunk) => ({
        documentId: chunk.documentId,
        companyId: chunk.companyId,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        qdrantPointId: chunk.qdrantPointId,
        chunkHash: chunk.chunkHash,
        embeddingModel: chunk.embeddingModel,
      })),
    });
  }

  async deleteAllByDocumentId(documentId: string): Promise<void> {
    await this.prisma.documentChunk.deleteMany({ where: { documentId } });
  }
}
