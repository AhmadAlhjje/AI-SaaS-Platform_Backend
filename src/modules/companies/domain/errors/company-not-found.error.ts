import { DomainError } from '../../../../shared/exceptions/domain.error';

export class CompanyNotFoundError extends DomainError {
  readonly code = 'COMPANY_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(identifier: string) {
    super(`Company ${identifier} was not found.`);
  }
}
