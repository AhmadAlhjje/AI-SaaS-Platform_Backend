import { DEFAULT_LANGUAGE, Language } from '../value-objects/language.value-object';
import { Theme } from '../value-objects/theme.value-object';

export const DEFAULT_THEME = Theme.LIGHT;

interface ReconstituteProps {
  readonly id: string;
  readonly companyId: string;
  readonly theme: Theme;
  readonly language: Language;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface UpdateChanges {
  readonly theme?: Theme;
  readonly language?: Language;
}

/**
 * `id` is null until persisted — the database generates it (see schema.prisma
 * settings.id @default(uuid())). One row per company (1:1).
 */
export class SettingEntity {
  private constructor(
    public readonly id: string | null,
    public readonly companyId: string,
    public readonly theme: Theme,
    public readonly language: Language,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static createDefault(companyId: string): SettingEntity {
    const now = new Date();
    return new SettingEntity(null, companyId, DEFAULT_THEME, DEFAULT_LANGUAGE, now, now);
  }

  static reconstitute(props: ReconstituteProps): SettingEntity {
    return new SettingEntity(props.id, props.companyId, props.theme, props.language, props.createdAt, props.updatedAt);
  }

  update(changes: UpdateChanges): SettingEntity {
    return new SettingEntity(
      this.id,
      this.companyId,
      changes.theme ?? this.theme,
      changes.language ?? this.language,
      this.createdAt,
      new Date(),
    );
  }
}
