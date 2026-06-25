import { DocumentEntity } from '../../domain/entities/document.entity';

export class DocumentResponse {
  readonly id: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly knowledgeType: string;
  readonly status: string;
  readonly createdAt: Date;

  constructor(document: DocumentEntity) {
    this.id = document.id!;
    this.fileName = document.fileName;
    this.fileType = document.fileType;
    this.knowledgeType = document.knowledgeType;
    this.status = document.status;
    this.createdAt = document.createdAt;
  }
}
