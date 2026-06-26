import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { PDF_FILE_TYPE } from '../../domain/entities/document.entity';
import { DocumentRepository } from '../../domain/repositories/document.repository';

export interface DocumentUsageSummary {
  readonly documentsUsed: number;
  readonly dataTablesUsed: number;
}

/** Mirrors exactly what UploadDocumentUseCase checks against plan limits before accepting a file. */
@Injectable()
export class GetDocumentUsageUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.DOCUMENT_REPOSITORY) private readonly documentRepository: DocumentRepository) {}

  async execute(companyId: string): Promise<DocumentUsageSummary> {
    const [documentsUsed, dataTablesUsed] = await Promise.all([
      this.documentRepository.countByCompanyId(companyId),
      this.documentRepository.countByCompanyIdExcludingFileType(companyId, PDF_FILE_TYPE),
    ]);

    return { documentsUsed, dataTablesUsed };
  }
}
