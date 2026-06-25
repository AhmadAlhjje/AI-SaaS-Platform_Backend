import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { DocumentNotFoundError } from '../../domain/errors/document-not-found.error';
import { DOCUMENT_DELETED_EVENT, DocumentDeletedEvent } from '../../domain/events/document-deleted.event';
import { StorageProvider } from '../../domain/interfaces/storage-provider.interface';
import { DocumentRepository } from '../../domain/repositories/document.repository';

export interface DeleteDocumentInput {
  readonly documentId: string;
  readonly companyId: string;
}

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
    @Inject(PROVIDER_TOKENS.STORAGE_PROVIDER) private readonly storageProvider: StorageProvider,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: DeleteDocumentInput): Promise<void> {
    const document = await this.documentRepository.findById(input.documentId);

    if (!document || document.companyId !== input.companyId) {
      throw new DocumentNotFoundError(input.documentId);
    }

    await this.documentRepository.softDelete(document.id!);
    await this.storageProvider.delete(document.fileUrl);

    this.eventBus.publish(DOCUMENT_DELETED_EVENT, new DocumentDeletedEvent(document.id!, document.companyId));
  }
}
