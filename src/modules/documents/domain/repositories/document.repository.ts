import { DocumentEntity } from '../entities/document.entity';
import { DocumentStatus } from '../value-objects/document-status.value-object';

export interface FindAllByCompanyIdOptions {
  readonly search?: string;
  readonly skip: number;
  readonly take: number;
}

export interface DocumentRepository {
  findById(id: string): Promise<DocumentEntity | null>;
  findAllByCompanyId(companyId: string, options: FindAllByCompanyIdOptions): Promise<DocumentEntity[]>;
  countByCompanyId(companyId: string, search?: string): Promise<number>;
  countByCompanyIdExcludingFileType(companyId: string, excludedFileType: string): Promise<number>;
  create(document: DocumentEntity): Promise<DocumentEntity>;
  updateStatus(id: string, status: DocumentStatus): Promise<void>;
  softDelete(id: string): Promise<void>;
}
