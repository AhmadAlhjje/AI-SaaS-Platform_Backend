import { DomainError } from '../../../../shared/exceptions/domain.error';

export class DocumentNotReprocessableError extends DomainError {
  readonly code = 'DOCUMENT_NOT_REPROCESSABLE';
  readonly httpStatus = 409;

  constructor(documentId: string) {
    super(`Document ${documentId} is not in a failed state and cannot be reprocessed.`);
  }
}
