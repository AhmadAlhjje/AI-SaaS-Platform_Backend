import { DomainError } from '../../../../shared/exceptions/domain.error';

/**
 * USER 1:1 COMPANY per ROLE.md §11 — a user may only ever own one company.
 */
export class CompanyAlreadyExistsError extends DomainError {
  readonly code = 'COMPANY_ALREADY_EXISTS';
  readonly httpStatus = 409;

  constructor(userId: string) {
    super(`User ${userId} already has a company.`);
  }
}
