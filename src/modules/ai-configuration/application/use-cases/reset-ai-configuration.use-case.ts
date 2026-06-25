import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { AiConfigurationEntity } from '../../domain/entities/ai-configuration.entity';
import { AiConfigurationRepository } from '../../domain/repositories/ai-configuration.repository';

export interface ResetAiConfigurationInput {
  readonly companyId: string;
}

@Injectable()
export class ResetAiConfigurationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.AI_CONFIGURATION_REPOSITORY)
    private readonly aiConfigurationRepository: AiConfigurationRepository,
  ) {}

  async execute(input: ResetAiConfigurationInput): Promise<AiConfigurationEntity> {
    const existing =
      (await this.aiConfigurationRepository.findByCompanyId(input.companyId)) ??
      (await this.aiConfigurationRepository.create(AiConfigurationEntity.createDefault(input.companyId)));

    return this.aiConfigurationRepository.update(existing.reset());
  }
}
