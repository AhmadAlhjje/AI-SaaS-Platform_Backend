interface ReconstituteProps {
  readonly id: string;
  readonly companyId: string;
  readonly name: string;
  readonly keyHash: string;
  readonly lastUsedAt: Date | null;
  readonly revokedAt: Date | null;
  readonly createdAt: Date;
}

/**
 * `id` is null until persisted — the database generates it (see schema.prisma
 * api_keys.id @default(uuid())).
 */
export class ApiKeyEntity {
  private constructor(
    public readonly id: string | null,
    public readonly companyId: string,
    public readonly name: string,
    public readonly keyHash: string,
    public readonly lastUsedAt: Date | null,
    public readonly revokedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  static create(companyId: string, name: string, keyHash: string): ApiKeyEntity {
    return new ApiKeyEntity(null, companyId, name, keyHash, null, null, new Date());
  }

  static reconstitute(props: ReconstituteProps): ApiKeyEntity {
    return new ApiKeyEntity(
      props.id,
      props.companyId,
      props.name,
      props.keyHash,
      props.lastUsedAt,
      props.revokedAt,
      props.createdAt,
    );
  }

  isActive(): boolean {
    return this.revokedAt === null;
  }

  revoke(): ApiKeyEntity {
    return new ApiKeyEntity(this.id, this.companyId, this.name, this.keyHash, this.lastUsedAt, new Date(), this.createdAt);
  }
}
