import { Module } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { DeleteDocumentUseCase } from './application/use-cases/delete-document.use-case';
import { GetDocumentUseCase } from './application/use-cases/get-document.use-case';
import { ListDocumentsUseCase } from './application/use-cases/list-documents.use-case';
import { UploadDocumentUseCase } from './application/use-cases/upload-document.use-case';
import { S3StorageProvider } from './infrastructure/providers/s3-storage.provider';
import { PrismaDocumentRepository } from './infrastructure/repositories/prisma-document.repository';
import { DocumentsController } from './presentation/controllers/documents.controller';

@Module({
  controllers: [DocumentsController],
  providers: [
    UploadDocumentUseCase,
    GetDocumentUseCase,
    ListDocumentsUseCase,
    DeleteDocumentUseCase,
    { provide: REPOSITORY_TOKENS.DOCUMENT_REPOSITORY, useClass: PrismaDocumentRepository },
    { provide: PROVIDER_TOKENS.STORAGE_PROVIDER, useClass: S3StorageProvider },
  ],
})
export class DocumentsModule {}
