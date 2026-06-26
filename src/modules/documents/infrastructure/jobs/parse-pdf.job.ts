import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import pdfParse from 'pdf-parse';
import { PROVIDER_TOKENS } from '../../../../shared/constants/tokens.constants';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { StorageProvider } from '../../../../shared/interfaces/storage-provider.interface';
import { DocumentProcessingFailureHandler } from './document-processing-failure.handler';
import { GenerateChunksJobData, ParsePdfJobData } from './job-data.types';

@Processor(QUEUE_NAMES.PARSE_PDF)
export class ParsePdfJob extends WorkerHost {
  constructor(
    @Inject(PROVIDER_TOKENS.STORAGE_PROVIDER) private readonly storageProvider: StorageProvider,
    @InjectQueue(QUEUE_NAMES.GENERATE_CHUNKS) private readonly generateChunksQueue: Queue<GenerateChunksJobData>,
    private readonly failureHandler: DocumentProcessingFailureHandler,
  ) {
    super();
  }

  async process(job: Job<ParsePdfJobData>): Promise<void> {
    const { documentId, companyId, fileKey } = job.data;

    try {
      const buffer = await this.storageProvider.download(fileKey);
      const { text } = await pdfParse(buffer);

      await this.generateChunksQueue.add(QUEUE_NAMES.GENERATE_CHUNKS, { documentId, companyId, text });
    } catch (error) {
      await this.failureHandler.handle(documentId, companyId);
      throw error;
    }
  }
}
