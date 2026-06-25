import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { AiConfigurationEntity } from '../../domain/entities/ai-configuration.entity';
import { AiConfigurationRepository } from '../../domain/repositories/ai-configuration.repository';

export interface UpdateAiConfigurationInput {
  readonly companyId: string;
  readonly systemPrompt?: string | null;
  readonly model?: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly ragTopK?: number;
}

@Injectable()
export class UpdateAiConfigurationUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.AI_CONFIGURATION_REPOSITORY)
    private readonly aiConfigurationRepository: AiConfigurationRepository,
  ) {}

  async execute(input: UpdateAiConfigurationInput): Promise<AiConfigurationEntity> {
    const existing =
      (await this.aiConfigurationRepository.findByCompanyId(input.companyId)) ??
      (await this.aiConfigurationRepository.create(AiConfigurationEntity.createDefault(input.companyId)));

    const updated = existing.update(input);
    return this.aiConfigurationRepository.update(updated);
  }
}
