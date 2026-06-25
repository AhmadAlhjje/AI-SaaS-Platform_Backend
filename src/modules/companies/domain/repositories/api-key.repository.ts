import { ApiKeyEntity } from '../entities/api-key.entity';

export interface ApiKeyRepository {
  findById(id: string): Promise<ApiKeyEntity | null>;
  findAllByCompanyId(companyId: string): Promise<ApiKeyEntity[]>;
  create(apiKey: ApiKeyEntity): Promise<ApiKeyEntity>;
  update(apiKey: ApiKeyEntity): Promise<ApiKeyEntity>;
}
