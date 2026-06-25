import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingRepository } from '../../domain/repositories/setting.repository';

export interface GetSettingsInput {
  readonly companyId: string;
}

@Injectable()
export class GetSettingsUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.SETTINGS_REPOSITORY) private readonly settingRepository: SettingRepository) {}

  async execute(input: GetSettingsInput): Promise<SettingEntity> {
    const existing = await this.settingRepository.findByCompanyId(input.companyId);
    if (existing) {
      return existing;
    }

    // Normally provisioned by ProvisionDefaultSettingsHandler reacting to
    // CompanyCreatedEvent — this covers the brief window before that (async)
    // handler runs, or a company created before this module existed.
    return this.settingRepository.create(SettingEntity.createDefault(input.companyId));
  }
}
