import { DomainError } from '../../../../shared/exceptions/domain.error';

export class AiProviderUnavailableError extends DomainError {
  readonly code = 'AI_PROVIDER_UNAVAILABLE';
  readonly httpStatus = 502;

  constructor(reason: string) {
    super(`The AI service is unavailable: ${reason}`);
  }
}
