import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingRepository } from '../../domain/repositories/setting.repository';
import { Theme } from '../../domain/value-objects/theme.value-object';

export interface UpdateThemeInput {
  readonly companyId: string;
  readonly theme: Theme;
}

@Injectable()
export class UpdateThemeUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.SETTINGS_REPOSITORY) private readonly settingRepository: SettingRepository) {}

  async execute(input: UpdateThemeInput): Promise<SettingEntity> {
    const existing =
      (await this.settingRepository.findByCompanyId(input.companyId)) ??
      (await this.settingRepository.create(SettingEntity.createDefault(input.companyId)));

    const updated = existing.update({ theme: input.theme });
    return this.settingRepository.update(updated);
  }
}
