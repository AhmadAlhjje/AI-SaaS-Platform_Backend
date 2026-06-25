import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingRepository } from '../../domain/repositories/setting.repository';
import { Language } from '../../domain/value-objects/language.value-object';

export interface UpdateLanguageInput {
  readonly companyId: string;
  readonly language: Language;
}

@Injectable()
export class UpdateLanguageUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.SETTINGS_REPOSITORY) private readonly settingRepository: SettingRepository) {}

  async execute(input: UpdateLanguageInput): Promise<SettingEntity> {
    const existing =
      (await this.settingRepository.findByCompanyId(input.companyId)) ??
      (await this.settingRepository.create(SettingEntity.createDefault(input.companyId)));

    const updated = existing.update({ language: input.language });
    return this.settingRepository.update(updated);
  }
}
