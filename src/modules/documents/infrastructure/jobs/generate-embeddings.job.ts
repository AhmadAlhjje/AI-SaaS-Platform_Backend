import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { GenerateEmbeddingsUseCase } from '../../../ai/application/use-cases/generate-embeddings.use-case';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { DocumentProcessingFailureHandler } from './document-processing-failure.handler';
import { EmbeddedChunkDraft, GenerateEmbeddingsJobData, IndexToQdrantJobData } from './job-data.types';

@Processor(QUEUE_NAMES.GENERATE_EMBEDDINGS)
export class GenerateEmbeddingsJob extends WorkerHost {
  constructor(
    private readonly generateEmbeddingsUseCase: GenerateEmbeddingsUseCase,
    @InjectQueue(QUEUE_NAMES.INDEX_TO_QDRANT) private readonly indexToQdrantQueue: Queue<IndexToQdrantJobData>,
    private readonly failureHandler: DocumentProcessingFailureHandler,
  ) {
    super();
  }

  async process(job: Job<GenerateEmbeddingsJobData>): Promise<void> {
    const { documentId, companyId, chunks } = job.data;

    try {
      const { vectors, model } = await this.generateEmbeddingsUseCase.execute({
        texts: chunks.map((chunk) => chunk.content),
      });

      const embeddedChunks: EmbeddedChunkDraft[] = chunks.map((chunk, index) => ({
        ...chunk,
        vector: vectors[index],
        embeddingModel: model,
      }));

      await this.indexToQdrantQueue.add(QUEUE_NAMES.INDEX_TO_QDRANT, { documentId, companyId, chunks: embeddedChunks });
    } catch (error) {
      await this.failureHandler.handle(documentId, companyId);
      throw error;
    }
  }
}
