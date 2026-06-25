import { randomUUID, createHash } from 'crypto';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { DocumentProcessingFailureHandler } from './document-processing-failure.handler';
import { ChunkDraft, GenerateChunksJobData, GenerateEmbeddingsJobData } from './job-data.types';

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 100;

function splitIntoChunks(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;
  while (start < trimmed.length) {
    const end = Math.min(start + CHUNK_SIZE, trimmed.length);
    chunks.push(trimmed.slice(start, end));
    if (end === trimmed.length) {
      break;
    }
    start = end - CHUNK_OVERLAP;
  }

  return chunks;
}

@Processor(QUEUE_NAMES.GENERATE_CHUNKS)
export class GenerateChunksJob extends WorkerHost {
  constructor(
    @InjectQueue(QUEUE_NAMES.GENERATE_EMBEDDINGS) private readonly generateEmbeddingsQueue: Queue<GenerateEmbeddingsJobData>,
    private readonly failureHandler: DocumentProcessingFailureHandler,
  ) {
    super();
  }

  async process(job: Job<GenerateChunksJobData>): Promise<void> {
    const { documentId, companyId, text } = job.data;

    try {
      const rawChunks = splitIntoChunks(text);
      if (rawChunks.length === 0) {
        throw new Error('No extractable text found in document');
      }

      const chunks: ChunkDraft[] = rawChunks.map((content, chunkIndex) => ({
        chunkIndex,
        content,
        chunkHash: createHash('sha256').update(content).digest('hex'),
        qdrantPointId: randomUUID(),
      }));

      await this.generateEmbeddingsQueue.add(QUEUE_NAMES.GENERATE_EMBEDDINGS, { documentId, companyId, chunks });
    } catch (error) {
      await this.failureHandler.handle(documentId, companyId);
      throw error;
    }
  }
}
