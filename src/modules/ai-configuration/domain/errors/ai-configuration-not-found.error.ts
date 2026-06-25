import { DomainError } from '../../../../shared/exceptions/domain.error';

export class AiConfigurationNotFoundError extends DomainError {
  readonly code = 'AI_CONFIGURATION_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(companyId: string) {
    super(`AI configuration for company ${companyId} was not found.`);
  }
}
