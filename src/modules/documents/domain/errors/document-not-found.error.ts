import { DomainError } from '../../../../shared/exceptions/domain.error';

export class DocumentNotFoundError extends DomainError {
  readonly code = 'DOCUMENT_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(documentId: string) {
    super(`Document ${documentId} was not found.`);
  }
}
