import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { ApiKeyRepository } from '../../domain/repositories/api-key.repository';

export interface ListApiKeysInput {
  readonly companyId: string;
}

@Injectable()
export class ListApiKeysUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.API_KEY_REPOSITORY) private readonly apiKeyRepository: ApiKeyRepository,
  ) {}

  execute(input: ListApiKeysInput): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.findAllByCompanyId(input.companyId);
  }
}
