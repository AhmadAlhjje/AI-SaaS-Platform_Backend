import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { QUEUE_NAMES } from '../../shared/constants/queue.constants';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { EnqueueDocumentProcessingHandler } from './application/event-handlers/enqueue-document-processing.handler';
import { DeleteDocumentUseCase } from './application/use-cases/delete-document.use-case';
import { GetDocumentUseCase } from './application/use-cases/get-document.use-case';
import { ListDocumentsUseCase } from './application/use-cases/list-documents.use-case';
import { UploadDocumentUseCase } from './application/use-cases/upload-document.use-case';
import { DocumentProcessingFailureHandler } from './infrastructure/jobs/document-processing-failure.handler';
import { GenerateChunksJob } from './infrastructure/jobs/generate-chunks.job';
import { GenerateEmbeddingsJob } from './infrastructure/jobs/generate-embeddings.job';
import { IndexToQdrantJob } from './infrastructure/jobs/index-to-qdrant.job';
import { ParsePdfJob } from './infrastructure/jobs/parse-pdf.job';
import { QdrantIndexerProvider } from './infrastructure/providers/qdrant-indexer.provider';
import { S3StorageProvider } from './infrastructure/providers/s3-storage.provider';
import { PrismaDocumentChunkRepository } from './infrastructure/repositories/prisma-document-chunk.repository';
import { PrismaDocumentRepository } from './infrastructure/repositories/prisma-document.repository';
import { DocumentsController } from './presentation/controllers/documents.controller';

@Module({
  imports: [
    AiModule,
    BullModule.registerQueue(
      { name: QUEUE_NAMES.PARSE_PDF },
      { name: QUEUE_NAMES.GENERATE_CHUNKS },
      { name: QUEUE_NAMES.GENERATE_EMBEDDINGS },
      { name: QUEUE_NAMES.INDEX_TO_QDRANT },
    ),
  ],
  controllers: [DocumentsController],
  providers: [
    UploadDocumentUseCase,
    GetDocumentUseCase,
    ListDocumentsUseCase,
    DeleteDocumentUseCase,
    EnqueueDocumentProcessingHandler,
    DocumentProcessingFailureHandler,
    ParsePdfJob,
    GenerateChunksJob,
    GenerateEmbeddingsJob,
    IndexToQdrantJob,
    { provide: REPOSITORY_TOKENS.DOCUMENT_REPOSITORY, useClass: PrismaDocumentRepository },
    { provide: REPOSITORY_TOKENS.DOCUMENT_CHUNK_REPOSITORY, useClass: PrismaDocumentChunkRepository },
    { provide: PROVIDER_TOKENS.STORAGE_PROVIDER, useClass: S3StorageProvider },
    { provide: PROVIDER_TOKENS.VECTOR_INDEXER, useClass: QdrantIndexerProvider },
  ],
})
export class DocumentsModule {}
