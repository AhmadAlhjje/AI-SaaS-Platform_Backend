import { DomainError } from '../../../../shared/exceptions/domain.error';

export class UnsupportedFileTypeError extends DomainError {
  readonly code = 'UNSUPPORTED_FILE_TYPE';
  readonly httpStatus = 422;

  constructor(fileType: string) {
    super(`File type "${fileType}" is not supported.`);
  }
}
