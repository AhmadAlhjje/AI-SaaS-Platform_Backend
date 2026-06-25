import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { DocumentRepository } from '../../domain/repositories/document.repository';

export interface ListDocumentsInput {
  readonly companyId: string;
}

@Injectable()
export class ListDocumentsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
  ) {}

  execute(input: ListDocumentsInput): Promise<DocumentEntity[]> {
    return this.documentRepository.findAllByCompanyId(input.companyId);
  }
}
