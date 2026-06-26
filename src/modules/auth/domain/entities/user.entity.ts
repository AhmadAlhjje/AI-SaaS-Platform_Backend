import { Email } from "../value-objects/email.value-object";

interface ReconstituteProps {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly companyId: string | null;
  readonly createdAt: Date;
}

/**
 * `id` is null until persisted — the database generates it (see schema.prisma
 * users.id @default(uuid())), so the domain never invents identifiers itself.
 */
export class UserEntity {
  private constructor(
    public readonly id: string | null,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly companyId: string | null,
    public readonly createdAt: Date,
  ) {}

  static register(
    name: string,
    email: string,
    passwordHash: string,
  ): UserEntity {
    return new UserEntity(
      null,
      name,
      new Email(email).toString(),
      passwordHash,
      null,
      new Date(),
    );
  }

  static reconstitute(props: ReconstituteProps): UserEntity {
    return new UserEntity(
      props.id,
      props.name,
      props.email,
      props.passwordHash,
      props.companyId,
      props.createdAt,
    );
  }
}
