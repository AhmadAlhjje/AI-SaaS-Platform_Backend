import { CompanyStatus } from '../value-objects/company-status.value-object';

interface ReconstituteProps {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly logo: string | null;
  readonly status: CompanyStatus;
  readonly createdAt: Date;
}

/**
 * `id` is null until persisted — the database generates it (see schema.prisma
 * companies.id @default(uuid())).
 */
export class CompanyEntity {
  private constructor(
    public readonly id: string | null,
    public readonly userId: string,
    public readonly name: string,
    public readonly logo: string | null,
    public readonly status: CompanyStatus,
    public readonly createdAt: Date,
  ) {}

  static create(userId: string, name: string, logo: string | null): CompanyEntity {
    return new CompanyEntity(null, userId, name, logo, CompanyStatus.ACTIVE, new Date());
  }

  static reconstitute(props: ReconstituteProps): CompanyEntity {
    return new CompanyEntity(props.id, props.userId, props.name, props.logo, props.status, props.createdAt);
  }

  update(changes: { name?: string; logo?: string | null }): CompanyEntity {
    return new CompanyEntity(
      this.id,
      this.userId,
      changes.name ?? this.name,
      changes.logo === undefined ? this.logo : changes.logo,
      this.status,
      this.createdAt,
    );
  }

  suspend(): CompanyEntity {
    return new CompanyEntity(this.id, this.userId, this.name, this.logo, CompanyStatus.SUSPENDED, this.createdAt);
  }
}
