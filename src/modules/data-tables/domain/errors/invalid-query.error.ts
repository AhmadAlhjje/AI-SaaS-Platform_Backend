import { DomainError } from '../../../../shared/exceptions/domain.error';

export class InvalidQueryError extends DomainError {
  readonly code = 'INVALID_QUERY';
  readonly httpStatus = 422;

  constructor(message: string) {
    super(message);
  }
}
