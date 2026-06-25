interface ReconstituteProps {
  readonly id: string;
  readonly companyId: string;
  readonly title: string | null;
  readonly createdAt: Date;
}

/**
 * `id` is null until persisted — the database generates it (see schema.prisma
 * conversations.id @default(uuid())).
 */
export class ConversationEntity {
  private constructor(
    public readonly id: string | null,
    public readonly companyId: string,
    public readonly title: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(companyId: string, title: string | null): ConversationEntity {
    return new ConversationEntity(null, companyId, title, new Date());
  }

  static reconstitute(props: ReconstituteProps): ConversationEntity {
    return new ConversationEntity(props.id, props.companyId, props.title, props.createdAt);
  }
}
