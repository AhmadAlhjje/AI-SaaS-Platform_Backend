import { randomBytes } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { ApiKeyHasher } from '../../domain/interfaces/api-key-hasher.interface';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';

export interface CreateApiKeyInput {
  readonly companyId: string;
  readonly name: string;
}

export interface CreateApiKeyResult {
  readonly apiKey: ApiKeyEntity;
  readonly rawKey: string;
}

const KEY_PREFIX = 'sk_live_';

@Injectable()
export class CreateApiKeyUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.API_KEY_REPOSITORY) private readonly apiKeyRepository: ApiKeyRepository,
    @Inject(PROVIDER_TOKENS.API_KEY_HASHER) private readonly apiKeyHasher: ApiKeyHasher,
  ) {}

  async execute(input: CreateApiKeyInput): Promise<CreateApiKeyResult> {
    const rawKey = `${KEY_PREFIX}${randomBytes(32).toString('hex')}`;
    const keyHash = this.apiKeyHasher.hash(rawKey);

    const apiKey = ApiKeyEntity.create(input.companyId, input.name, keyHash);
    const createdApiKey = await this.apiKeyRepository.create(apiKey);

    // rawKey is only ever returned here — it is not derivable from the stored hash.
    return { apiKey: createdApiKey, rawKey };
  }
}
