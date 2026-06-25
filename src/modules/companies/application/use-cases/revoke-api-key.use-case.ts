import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { ApiKeyNotFoundError } from '../../domain/errors/api-key-not-found.error';
import { API_KEY_REVOKED_EVENT, ApiKeyRevokedEvent } from '../../domain/events/api-key-revoked.event';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';

export interface RevokeApiKeyInput {
  readonly apiKeyId: string;
  readonly companyId: string;
}

@Injectable()
export class RevokeApiKeyUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.API_KEY_REPOSITORY) private readonly apiKeyRepository: ApiKeyRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: RevokeApiKeyInput): Promise<void> {
    const apiKey = await this.apiKeyRepository.findById(input.apiKeyId);

    // Ownership check (ROLE.md §10.4): an api key belonging to another
    // company must look identical to one that doesn't exist at all.
    if (!apiKey || apiKey.companyId !== input.companyId) {
      throw new ApiKeyNotFoundError(input.apiKeyId);
    }

    await this.apiKeyRepository.update(apiKey.revoke());
    this.eventBus.publish(API_KEY_REVOKED_EVENT, new ApiKeyRevokedEvent(input.apiKeyId, input.companyId));
  }
}
