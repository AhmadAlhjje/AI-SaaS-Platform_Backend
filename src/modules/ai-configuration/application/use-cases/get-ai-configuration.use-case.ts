import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { AiConfigurationEntity } from '../../domain/entities/ai-configuration.entity';
import { AiConfigurationRepository } from '../../domain/repositories/ai-configuration.repository';

export interface GetAiConfigurationInput {
  readonly companyId: string;
}

@Injectable()
export class GetAiConfigurationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.AI_CONFIGURATION_REPOSITORY)
    private readonly aiConfigurationRepository: AiConfigurationRepository,
  ) {}

  async execute(input: GetAiConfigurationInput): Promise<AiConfigurationEntity> {
    const existing = await this.aiConfigurationRepository.findByCompanyId(input.companyId);
    if (existing) {
      return existing;
    }

    // Normally provisioned by ProvisionDefaultAiConfigurationHandler reacting
    // to CompanyCreatedEvent — this covers the brief window before that
    // (async) handler runs, or a company created before this module existed.
    return this.aiConfigurationRepository.create(AiConfigurationEntity.createDefault(input.companyId));
  }
}
