import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { DocumentNotFoundError } from '../../domain/errors/document-not-found.error';
import { DOCUMENT_DELETED_EVENT, DocumentDeletedEvent } from '../../domain/events/document-deleted.event';
import { StorageProvider } from '../../domain/interfaces/storage-provider.interface';
import { VectorIndexer } from '../../domain/interfaces/vector-indexer.interface';
import { DocumentChunkRepository } from '../../domain/repositories/document-chunk.repository';
import { DocumentRepository } from '../../domain/repositories/document.repository';

export interface DeleteDocumentInput {
  readonly documentId: string;
  readonly companyId: string;
}

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
    @Inject(REPOSITORY_TOKENS.DOCUMENT_CHUNK_REPOSITORY) private readonly documentChunkRepository: DocumentChunkRepository,
    @Inject(PROVIDER_TOKENS.STORAGE_PROVIDER) private readonly storageProvider: StorageProvider,
    @Inject(PROVIDER_TOKENS.VECTOR_INDEXER) private readonly vectorIndexer: VectorIndexer,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: DeleteDocumentInput): Promise<void> {
    const document = await this.documentRepository.findById(input.documentId);

    if (!document || document.companyId !== input.companyId) {
      throw new DocumentNotFoundError(input.documentId);
    }

    // Soft-delete (deletedAt) means Postgres' ON DELETE CASCADE on
    // document_chunks never fires — chunks and their Qdrant points have to
    // be cleaned up explicitly here.
    await this.documentChunkRepository.deleteAllByDocumentId(document.id!);
    await this.vectorIndexer.deleteByDocumentId(document.id!);
    await this.documentRepository.softDelete(document.id!);
    await this.storageProvider.delete(document.fileUrl);

    this.eventBus.publish(DOCUMENT_DELETED_EVENT, new DocumentDeletedEvent(document.id!, document.companyId));
  }
}
