import { ApiKeyEntity } from '../../domain/entities/api-key.entity';

export class ApiKeyResponse {
  readonly id: string;
  readonly name: string;
  readonly lastUsedAt: Date | null;
  readonly revokedAt: Date | null;
  readonly createdAt: Date;
  // Only ever populated once, by the create endpoint — never persisted or re-derivable.
  readonly secret?: string;

  constructor(apiKey: ApiKeyEntity, secret?: string) {
    this.id = apiKey.id!;
    this.name = apiKey.name;
    this.lastUsedAt = apiKey.lastUsedAt;
    this.revokedAt = apiKey.revokedAt;
    this.createdAt = apiKey.createdAt;
    this.secret = secret;
  }
}
