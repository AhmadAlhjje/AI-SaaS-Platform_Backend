import { SettingEntity } from '../../domain/entities/setting.entity';

export class SettingsResponse {
  readonly id: string;
  readonly theme: string;
  readonly language: string;
  readonly updatedAt: Date;

  constructor(setting: SettingEntity) {
    this.id = setting.id!;
    this.theme = setting.theme;
    this.language = setting.language;
    this.updatedAt = setting.updatedAt;
  }
}
