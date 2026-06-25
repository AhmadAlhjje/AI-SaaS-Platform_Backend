import { AiConfigurationEntity } from '../entities/ai-configuration.entity';

export interface AiConfigurationRepository {
  findByCompanyId(companyId: string): Promise<AiConfigurationEntity | null>;
  create(config: AiConfigurationEntity): Promise<AiConfigurationEntity>;
  update(config: AiConfigurationEntity): Promise<AiConfigurationEntity>;
}
