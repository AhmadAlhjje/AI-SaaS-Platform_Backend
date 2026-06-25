import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CompanyCreatedEvent, COMPANY_CREATED_EVENT } from '../../../companies/domain/events/company-created.event';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingRepository } from '../../domain/repositories/setting.repository';

@Injectable()
export class ProvisionDefaultSettingsHandler {
  constructor(
    @Inject(REPOSITORY_TOKENS.SETTINGS_REPOSITORY) private readonly settingRepository: SettingRepository,
  ) {}

  @OnEvent(COMPANY_CREATED_EVENT)
  async handle(event: CompanyCreatedEvent): Promise<void> {
    const existing = await this.settingRepository.findByCompanyId(event.companyId);
    if (existing) {
      return;
    }

    await this.settingRepository.create(SettingEntity.createDefault(event.companyId));
  }
}
