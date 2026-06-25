import { DomainError } from '../../../../shared/exceptions/domain.error';

export class ApiKeyNotFoundError extends DomainError {
  readonly code = 'API_KEY_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(apiKeyId: string) {
    super(`API key ${apiKeyId} was not found.`);
  }
}
