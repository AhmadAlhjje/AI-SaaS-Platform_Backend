import { DomainError } from '../../../../shared/exceptions/domain.error';
import { UsageResource } from '../value-objects/usage-resource.value-object';

export class UsageLimitExceededError extends DomainError {
  readonly code = 'USAGE_LIMIT_EXCEEDED';
  readonly httpStatus = 403;

  constructor(resource: UsageResource, limit: number) {
    super(`Usage limit reached for "${resource}" (limit: ${limit}). Upgrade your plan to continue.`);
  }
}
