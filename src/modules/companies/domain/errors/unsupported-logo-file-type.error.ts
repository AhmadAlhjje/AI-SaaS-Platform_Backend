import { DomainError } from '../../../../shared/exceptions/domain.error';

export class UnsupportedLogoFileTypeError extends DomainError {
  readonly code = 'UNSUPPORTED_LOGO_FILE_TYPE';
  readonly httpStatus = 422;

  constructor(fileType: string) {
    super(`Logo file type "${fileType}" is not supported.`);
  }
}
