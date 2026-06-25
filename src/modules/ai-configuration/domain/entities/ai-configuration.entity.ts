// Mirrors the Prisma column defaults (schema.prisma AiConfiguration) so a
// freshly-provisioned config and the DB's own defaults never disagree.
export const DEFAULT_MODEL = 'gpt-4o-mini';
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 1000;
export const DEFAULT_RAG_TOP_K = 5;

interface ReconstituteProps {
  readonly id: string;
  readonly companyId: string;
  readonly systemPrompt: string | null;
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
  readonly ragTopK: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface UpdateChanges {
  readonly systemPrompt?: string | null;
  readonly model?: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly ragTopK?: number;
}

/**
 * `id` is null until persisted — the database generates it (see schema.prisma
 * ai_configurations.id @default(uuid())). One row per company (1:1).
 */
export class AiConfigurationEntity {
  private constructor(
    public readonly id: string | null,
    public readonly companyId: string,
    public readonly systemPrompt: string | null,
    public readonly model: string,
    public readonly temperature: number,
    public readonly maxTokens: number,
    public readonly ragTopK: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static createDefault(companyId: string): AiConfigurationEntity {
    const now = new Date();
    return new AiConfigurationEntity(
      null,
      companyId,
      null,
      DEFAULT_MODEL,
      DEFAULT_TEMPERATURE,
      DEFAULT_MAX_TOKENS,
      DEFAULT_RAG_TOP_K,
      now,
      now,
    );
  }

  static reconstitute(props: ReconstituteProps): AiConfigurationEntity {
    return new AiConfigurationEntity(
      props.id,
      props.companyId,
      props.systemPrompt,
      props.model,
      props.temperature,
      props.maxTokens,
      props.ragTopK,
      props.createdAt,
      props.updatedAt,
    );
  }

  update(changes: UpdateChanges): AiConfigurationEntity {
    return new AiConfigurationEntity(
      this.id,
      this.companyId,
      changes.systemPrompt === undefined ? this.systemPrompt : changes.systemPrompt,
      changes.model ?? this.model,
      changes.temperature ?? this.temperature,
      changes.maxTokens ?? this.maxTokens,
      changes.ragTopK ?? this.ragTopK,
      this.createdAt,
      new Date(),
    );
  }

  reset(): AiConfigurationEntity {
    return new AiConfigurationEntity(
      this.id,
      this.companyId,
      null,
      DEFAULT_MODEL,
      DEFAULT_TEMPERATURE,
      DEFAULT_MAX_TOKENS,
      DEFAULT_RAG_TOP_K,
      this.createdAt,
      new Date(),
    );
  }
}
