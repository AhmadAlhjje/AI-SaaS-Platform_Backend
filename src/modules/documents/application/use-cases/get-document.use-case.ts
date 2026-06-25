import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { DocumentNotFoundError } from '../../domain/errors/document-not-found.error';
import { DocumentRepository } from '../../domain/repositories/document.repository';

export interface GetDocumentInput {
  readonly documentId: string;
  readonly companyId: string;
}

@Injectable()
export class GetDocumentUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
  ) {}

  async execute(input: GetDocumentInput): Promise<DocumentEntity> {
    const document = await this.documentRepository.findById(input.documentId);

    // Ownership check (ROLE.md §10.4): a document belonging to another
    // company must look identical to one that doesn't exist at all.
    if (!document || document.companyId !== input.companyId) {
      throw new DocumentNotFoundError(input.documentId);
    }

    return document;
  }
}
