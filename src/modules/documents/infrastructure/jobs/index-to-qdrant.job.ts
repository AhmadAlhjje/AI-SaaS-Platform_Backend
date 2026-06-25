import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { DocumentChunkEntity } from '../../domain/entities/document-chunk.entity';
import { DOCUMENT_PROCESSED_EVENT, DocumentProcessedEvent } from '../../domain/events/document-processed.event';
import { VectorIndexer } from '../../domain/interfaces/vector-indexer.interface';
import { DocumentChunkRepository } from '../../domain/repositories/document-chunk.repository';
import { DocumentRepository } from '../../domain/repositories/document.repository';
import { DocumentStatus } from '../../domain/value-objects/document-status.value-object';
import { DocumentProcessingFailureHandler } from './document-processing-failure.handler';
import { IndexToQdrantJobData } from './job-data.types';

@Processor(QUEUE_NAMES.INDEX_TO_QDRANT)
export class IndexToQdrantJob extends WorkerHost {
  constructor(
    @Inject(PROVIDER_TOKENS.VECTOR_INDEXER) private readonly vectorIndexer: VectorIndexer,
    @Inject(REPOSITORY_TOKENS.DOCUMENT_CHUNK_REPOSITORY) private readonly documentChunkRepository: DocumentChunkRepository,
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
    private readonly eventBus: EventBus,
    private readonly failureHandler: DocumentProcessingFailureHandler,
  ) {
    super();
  }

  async process(job: Job<IndexToQdrantJobData>): Promise<void> {
    const { documentId, companyId, chunks } = job.data;

    try {
      await this.vectorIndexer.upsert(
        chunks.map((chunk) => ({
          id: chunk.qdrantPointId,
          vector: chunk.vector,
          payload: { companyId, documentId, chunkIndex: chunk.chunkIndex, content: chunk.content },
        })),
      );

      await this.documentChunkRepository.createMany(
        chunks.map((chunk) =>
          DocumentChunkEntity.create(documentId, companyId, chunk.chunkIndex, chunk.content, chunk.chunkHash, chunk.qdrantPointId).withEmbeddingModel(
            chunk.embeddingModel,
          ),
        ),
      );

      await this.documentRepository.updateStatus(documentId, DocumentStatus.READY);
      this.eventBus.publish(DOCUMENT_PROCESSED_EVENT, new DocumentProcessedEvent(documentId, companyId, DocumentStatus.READY));
    } catch (error) {
      await this.failureHandler.handle(documentId, companyId);
      throw error;
    }
  }
}
