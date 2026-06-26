import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { DocumentEntity } from '../../domain/entities/document.entity';
import { DocumentRepository } from '../../domain/repositories/document.repository';

export interface ListDocumentsInput {
  readonly companyId: string;
  readonly search?: string;
  readonly page: number;
  readonly limit: number;
}

export interface ListDocumentsResult {
  readonly items: DocumentEntity[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

@Injectable()
export class ListDocumentsUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository,
  ) {}

  async execute(input: ListDocumentsInput): Promise<ListDocumentsResult> {
    const skip = (input.page - 1) * input.limit;

    const [items, total] = await Promise.all([
      this.documentRepository.findAllByCompanyId(input.companyId, {
        search: input.search,
        skip,
        take: input.limit,
      }),
      this.documentRepository.countByCompanyId(input.companyId, input.search),
    ]);

    return { items, total, page: input.page, limit: input.limit };
  }
}
