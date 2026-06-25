import { DocumentEntity } from '../entities/document.entity';
import { DocumentStatus } from '../value-objects/document-status.value-object';

export interface DocumentRepository {
  findById(id: string): Promise<DocumentEntity | null>;
  findAllByCompanyId(companyId: string): Promise<DocumentEntity[]>;
  create(document: DocumentEntity): Promise<DocumentEntity>;
  updateStatus(id: string, status: DocumentStatus): Promise<void>;
  softDelete(id: string): Promise<void>;
}
