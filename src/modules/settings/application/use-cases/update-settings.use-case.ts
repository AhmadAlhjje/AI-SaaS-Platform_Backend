import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingRepository } from '../../domain/repositories/setting.repository';
import { Language } from '../../domain/value-objects/language.value-object';
import { Theme } from '../../domain/value-objects/theme.value-object';

export interface UpdateSettingsInput {
  readonly companyId: string;
  readonly theme?: Theme;
  readonly language?: Language;
}

@Injectable()
export class UpdateSettingsUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.SETTINGS_REPOSITORY) private readonly settingRepository: SettingRepository) {}

  async execute(input: UpdateSettingsInput): Promise<SettingEntity> {
    const existing =
      (await this.settingRepository.findByCompanyId(input.companyId)) ??
      (await this.settingRepository.create(SettingEntity.createDefault(input.companyId)));

    const updated = existing.update(input);
    return this.settingRepository.update(updated);
  }
}
