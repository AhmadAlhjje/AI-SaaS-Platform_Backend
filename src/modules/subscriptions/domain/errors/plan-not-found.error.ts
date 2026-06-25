import { DomainError } from '../../../../shared/exceptions/domain.error';

export class PlanNotFoundError extends DomainError {
  readonly code = 'PLAN_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(planId: string) {
    super(`Plan ${planId} was not found.`);
  }
}
