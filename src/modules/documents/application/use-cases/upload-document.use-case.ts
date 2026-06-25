import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { DOCUMENT_UPLOADED_EVENT, DocumentUploadedEvent } from '../../domain/events/document-uploaded.event';
import { StorageProvider } from '../../domain/interfaces/storage-provider.interface';
import { DocumentRepository } from '../../domain/repositories/document.repository';

export interface UploadDocumentInput {
  readonly companyId: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly knowledgeType: string;
  readonly buffer: Buffer;
}

@Injectable()
export class UploadDocumentUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
    @Inject(PROVIDER_TOKENS.STORAGE_PROVIDER) private readonly storageProvider: StorageProvider,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: UploadDocumentInput): Promise<DocumentEntity> {
    // Validated before paying for the upload — fail fast on an unsupported type.
    DocumentEntity.assertSupportedFileType(input.fileType);

    const key = `documents/${input.companyId}/${randomUUID()}-${input.fileName}`;
    const fileUrl = await this.storageProvider.upload({
      key,
      buffer: input.buffer,
      contentType: input.fileType,
    });

    const document = DocumentEntity.create(input.companyId, input.fileName, input.fileType, fileUrl, input.knowledgeType);
    const createdDocument = await this.documentRepository.create(document);

    this.eventBus.publish(
      DOCUMENT_UPLOADED_EVENT,
      new DocumentUploadedEvent(
        createdDocument.id!,
        createdDocument.companyId,
        createdDocument.fileType,
        createdDocument.fileUrl,
        createdDocument.fileName,
      ),
    );

    return createdDocument;
  }
}
