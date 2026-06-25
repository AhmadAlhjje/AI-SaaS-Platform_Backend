import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { GetSettingsUseCase } from '../../application/use-cases/get-settings.use-case';
import { UpdateLanguageUseCase } from '../../application/use-cases/update-language.use-case';
import { UpdateSettingsUseCase } from '../../application/use-cases/update-settings.use-case';
import { UpdateThemeUseCase } from '../../application/use-cases/update-theme.use-case';
import { UpdateLanguageDto } from '../dto/update-language.dto';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import { UpdateThemeDto } from '../dto/update-theme.dto';
import { SettingsResponse } from '../responses/settings.response';

@Controller('settings')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class SettingsController {
  constructor(
    private readonly getSettingsUseCase: GetSettingsUseCase,
    private readonly updateSettingsUseCase: UpdateSettingsUseCase,
    private readonly updateThemeUseCase: UpdateThemeUseCase,
    private readonly updateLanguageUseCase: UpdateLanguageUseCase,
  ) {}

  @Get()
  async get(@CurrentCompany() companyId: string): Promise<SettingsResponse> {
    const setting = await this.getSettingsUseCase.execute({ companyId });
    return new SettingsResponse(setting);
  }

  @Patch()
  async update(@CurrentCompany() companyId: string, @Body() dto: UpdateSettingsDto): Promise<SettingsResponse> {
    const setting = await this.updateSettingsUseCase.execute({ companyId, ...dto });
    return new SettingsResponse(setting);
  }

  @Patch('theme')
  async updateTheme(@CurrentCompany() companyId: string, @Body() dto: UpdateThemeDto): Promise<SettingsResponse> {
    const setting = await this.updateThemeUseCase.execute({ companyId, theme: dto.theme });
    return new SettingsResponse(setting);
  }

  @Patch('language')
  async updateLanguage(@CurrentCompany() companyId: string, @Body() dto: UpdateLanguageDto): Promise<SettingsResponse> {
    const setting = await this.updateLanguageUseCase.execute({ companyId, language: dto.language });
    return new SettingsResponse(setting);
  }
}
