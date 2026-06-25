import { Module } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { ProvisionDefaultSettingsHandler } from './application/event-handlers/provision-default-settings.handler';
import { GetSettingsUseCase } from './application/use-cases/get-settings.use-case';
import { UpdateLanguageUseCase } from './application/use-cases/update-language.use-case';
import { UpdateSettingsUseCase } from './application/use-cases/update-settings.use-case';
import { UpdateThemeUseCase } from './application/use-cases/update-theme.use-case';
import { PrismaSettingRepository } from './infrastructure/repositories/prisma-setting.repository';
import { SettingsController } from './presentation/controllers/settings.controller';

@Module({
  controllers: [SettingsController],
  providers: [
    GetSettingsUseCase,
    UpdateSettingsUseCase,
    UpdateThemeUseCase,
    UpdateLanguageUseCase,
    ProvisionDefaultSettingsHandler,
    { provide: REPOSITORY_TOKENS.SETTINGS_REPOSITORY, useClass: PrismaSettingRepository },
  ],
})
export class SettingsModule {}
