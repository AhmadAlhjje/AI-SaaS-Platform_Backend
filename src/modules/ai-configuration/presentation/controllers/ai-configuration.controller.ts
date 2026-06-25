import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { GetAiConfigurationUseCase } from '../../application/use-cases/get-ai-configuration.use-case';
import { ResetAiConfigurationUseCase } from '../../application/use-cases/reset-ai-configuration.use-case';
import { UpdateAiConfigurationUseCase } from '../../application/use-cases/update-ai-configuration.use-case';
import { UpdateAiConfigurationDto } from '../dto/update-ai-configuration.dto';
import { AiConfigurationResponse } from '../responses/ai-configuration.response';

@Controller('ai-configuration')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class AiConfigurationController {
  constructor(
    private readonly getAiConfigurationUseCase: GetAiConfigurationUseCase,
    private readonly updateAiConfigurationUseCase: UpdateAiConfigurationUseCase,
    private readonly resetAiConfigurationUseCase: ResetAiConfigurationUseCase,
  ) {}

  @Get()
  async get(@CurrentCompany() companyId: string): Promise<AiConfigurationResponse> {
    const config = await this.getAiConfigurationUseCase.execute({ companyId });
    return new AiConfigurationResponse(config);
  }

  @Patch()
  async update(
    @CurrentCompany() companyId: string,
    @Body() dto: UpdateAiConfigurationDto,
  ): Promise<AiConfigurationResponse> {
    const config = await this.updateAiConfigurationUseCase.execute({ companyId, ...dto });
    return new AiConfigurationResponse(config);
  }

  @Post('reset')
  async reset(@CurrentCompany() companyId: string): Promise<AiConfigurationResponse> {
    const config = await this.resetAiConfigurationUseCase.execute({ companyId });
    return new AiConfigurationResponse(config);
  }
}
