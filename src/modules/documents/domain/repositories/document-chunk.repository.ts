import { DocumentChunkEntity } from '../entities/document-chunk.entity';

export interface DocumentChunkRepository {
  createMany(chunks: readonly DocumentChunkEntity[]): Promise<void>;
  deleteAllByDocumentId(documentId: string): Promise<void>;
}
