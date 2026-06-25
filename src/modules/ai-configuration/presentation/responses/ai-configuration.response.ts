import { AiConfigurationEntity } from '../../domain/entities/ai-configuration.entity';

export class AiConfigurationResponse {
  readonly id: string;
  readonly systemPrompt: string | null;
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
  readonly ragTopK: number;
  readonly updatedAt: Date;

  constructor(config: AiConfigurationEntity) {
    this.id = config.id!;
    this.systemPrompt = config.systemPrompt;
    this.model = config.model;
    this.temperature = config.temperature;
    this.maxTokens = config.maxTokens;
    this.ragTopK = config.ragTopK;
    this.updatedAt = config.updatedAt;
  }
}
