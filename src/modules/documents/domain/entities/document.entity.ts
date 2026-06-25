import { UnsupportedFileTypeError } from '../errors/unsupported-file-type.error';
import { DocumentStatus } from '../value-objects/document-status.value-object';

// PDF / CSV / Excel per ROLE.md §1 — RAG for unstructured PDF, SQL Agent for CSV/Excel.
export const PDF_FILE_TYPE = 'application/pdf';

const SUPPORTED_FILE_TYPES = new Set<string>([
  PDF_FILE_TYPE,
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

interface ReconstituteProps {
  readonly id: string;
  readonly companyId: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly fileUrl: string;
  readonly knowledgeType: string;
  readonly status: DocumentStatus;
  readonly createdAt: Date;
}

/**
 * `id` is null until persisted — the database generates it (see schema.prisma
 * documents.id @default(uuid())).
 */
export class DocumentEntity {
  private constructor(
    public readonly id: string | null,
    public readonly companyId: string,
    public readonly fileName: string,
    public readonly fileType: string,
    public readonly fileUrl: string,
    public readonly knowledgeType: string,
    public readonly status: DocumentStatus,
    public readonly createdAt: Date,
  ) {}

  static assertSupportedFileType(fileType: string): void {
    if (!SUPPORTED_FILE_TYPES.has(fileType)) {
      throw new UnsupportedFileTypeError(fileType);
    }
  }

  static create(
    companyId: string,
    fileName: string,
    fileType: string,
    fileUrl: string,
    knowledgeType: string,
  ): DocumentEntity {
    DocumentEntity.assertSupportedFileType(fileType);
    return new DocumentEntity(null, companyId, fileName, fileType, fileUrl, knowledgeType, DocumentStatus.PROCESSING, new Date());
  }

  static reconstitute(props: ReconstituteProps): DocumentEntity {
    return new DocumentEntity(
      props.id,
      props.companyId,
      props.fileName,
      props.fileType,
      props.fileUrl,
      props.knowledgeType,
      props.status,
      props.createdAt,
    );
  }

  isPdf(): boolean {
    return this.fileType === PDF_FILE_TYPE;
  }

  markReady(): DocumentEntity {
    return new DocumentEntity(
      this.id,
      this.companyId,
      this.fileName,
      this.fileType,
      this.fileUrl,
      this.knowledgeType,
      DocumentStatus.READY,
      this.createdAt,
    );
  }

  markFailed(): DocumentEntity {
    return new DocumentEntity(
      this.id,
      this.companyId,
      this.fileName,
      this.fileType,
      this.fileUrl,
      this.knowledgeType,
      DocumentStatus.FAILED,
      this.createdAt,
    );
  }
}
