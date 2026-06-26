import { CompanyStatus } from '../value-objects/company-status.value-object';

interface ReconstituteProps {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly logo: string | null;
  readonly contactEmail: string | null;
  readonly contactPhone: string | null;
  readonly address: string | null;
  readonly website: string | null;
  readonly status: CompanyStatus;
  readonly createdAt: Date;
}

interface UpdateChanges {
  readonly name?: string;
  readonly logo?: string | null;
  readonly contactEmail?: string | null;
  readonly contactPhone?: string | null;
  readonly address?: string | null;
  readonly website?: string | null;
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
    public readonly contactEmail: string | null,
    public readonly contactPhone: string | null,
    public readonly address: string | null,
    public readonly website: string | null,
    public readonly status: CompanyStatus,
    public readonly createdAt: Date,
  ) {}

  static create(userId: string, name: string, logo: string | null): CompanyEntity {
    return new CompanyEntity(null, userId, name, logo, null, null, null, null, CompanyStatus.ACTIVE, new Date());
  }

  static reconstitute(props: ReconstituteProps): CompanyEntity {
    return new CompanyEntity(
      props.id,
      props.userId,
      props.name,
      props.logo,
      props.contactEmail,
      props.contactPhone,
      props.address,
      props.website,
      props.status,
      props.createdAt,
    );
  }

  update(changes: UpdateChanges): CompanyEntity {
    return new CompanyEntity(
      this.id,
      this.userId,
      changes.name ?? this.name,
      changes.logo === undefined ? this.logo : changes.logo,
      changes.contactEmail === undefined ? this.contactEmail : changes.contactEmail,
      changes.contactPhone === undefined ? this.contactPhone : changes.contactPhone,
      changes.address === undefined ? this.address : changes.address,
      changes.website === undefined ? this.website : changes.website,
      this.status,
      this.createdAt,
    );
  }

  suspend(): CompanyEntity {
    return new CompanyEntity(
      this.id,
      this.userId,
      this.name,
      this.logo,
      this.contactEmail,
      this.contactPhone,
      this.address,
      this.website,
      CompanyStatus.SUSPENDED,
      this.createdAt,
    );
  }
}
