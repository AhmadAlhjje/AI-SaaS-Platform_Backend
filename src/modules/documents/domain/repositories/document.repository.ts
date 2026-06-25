import { DocumentEntity } from '../entities/document.entity';

export interface DocumentRepository {
  findById(id: string): Promise<DocumentEntity | null>;
  findAllByCompanyId(companyId: string): Promise<DocumentEntity[]>;
  create(document: DocumentEntity): Promise<DocumentEntity>;
  softDelete(id: string): Promise<void>;
}
