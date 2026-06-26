import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { DocumentNotFoundError } from '../../domain/errors/document-not-found.error';
import { DocumentNotReprocessableError } from '../../domain/errors/document-not-reprocessable.error';
import { DOCUMENT_UPLOADED_EVENT, DocumentUploadedEvent } from '../../domain/events/document-uploaded.event';
import { DocumentRepository } from '../../domain/repositories/document.repository';
import { DocumentStatus } from '../../domain/value-objects/document-status.value-object';

export interface ReprocessDocumentInput {
  readonly documentId: string;
  readonly companyId: string;
}

/**
 * Re-runs the same pipeline upload uses (ROLE.md §14 flow), starting from
 * the file already stored in S3 — only documents stuck in `failed` are
 * eligible, since a `ready` document has nothing to recover from.
 */
@Injectable()
export class ReprocessDocumentUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: ReprocessDocumentInput): Promise<DocumentEntity> {
    const document = await this.documentRepository.findById(input.documentId);

    if (!document || document.companyId !== input.companyId) {
      throw new DocumentNotFoundError(input.documentId);
    }

    if (document.status !== DocumentStatus.FAILED) {
      throw new DocumentNotReprocessableError(document.id!);
    }

    await this.documentRepository.updateStatus(document.id!, DocumentStatus.PROCESSING);

    this.eventBus.publish(
      DOCUMENT_UPLOADED_EVENT,
      new DocumentUploadedEvent(document.id!, document.companyId, document.fileType, document.fileUrl, document.fileName),
    );

    return document.markProcessing();
  }
}
