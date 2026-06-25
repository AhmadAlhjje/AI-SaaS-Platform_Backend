export enum SenderType {
  USER = 'user',
  AI = 'ai',
}

export interface MessageUsage {
  readonly modelUsed: string;
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
}

interface ReconstituteProps {
  readonly id: string;
  readonly companyId: string;
  readonly conversationId: string;
  readonly senderType: SenderType;
  readonly content: string;
  readonly usage: MessageUsage | null;
  readonly createdAt: Date;
}

/**
 * `id` is null until persisted — the database generates it (see schema.prisma
 * messages.id @default(uuid())). `usage` is only ever set for AI-authored
 * messages — user messages carry no model/token accounting.
 */
export class MessageEntity {
  private constructor(
    public readonly id: string | null,
    public readonly companyId: string,
    public readonly conversationId: string,
    public readonly senderType: SenderType,
    public readonly content: string,
    public readonly usage: MessageUsage | null,
    public readonly createdAt: Date,
  ) {}

  static create(
    companyId: string,
    conversationId: string,
    senderType: SenderType,
    content: string,
    usage: MessageUsage | null = null,
  ): MessageEntity {
    return new MessageEntity(null, companyId, conversationId, senderType, content, usage, new Date());
  }

  static reconstitute(props: ReconstituteProps): MessageEntity {
    return new MessageEntity(
      props.id,
      props.companyId,
      props.conversationId,
      props.senderType,
      props.content,
      props.usage,
      props.createdAt,
    );
  }
}
