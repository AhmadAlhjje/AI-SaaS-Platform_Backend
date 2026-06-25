import { DomainError } from '../../../../shared/exceptions/domain.error';

export class SubscriptionNotFoundError extends DomainError {
  readonly code = 'SUBSCRIPTION_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(companyId: string) {
    super(`No active subscription was found for company ${companyId}.`);
  }
}
