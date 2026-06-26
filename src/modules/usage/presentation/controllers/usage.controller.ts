import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { GetUsageSummaryUseCase } from '../../application/use-cases/get-usage-summary.use-case';
import { UsageSummaryResponse } from '../responses/usage-summary.response';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class UsageController {
  constructor(private readonly getUsageSummaryUseCase: GetUsageSummaryUseCase) {}

  @Get('me/usage')
  async getMyUsage(@CurrentCompany() companyId: string): Promise<UsageSummaryResponse> {
    const summary = await this.getUsageSummaryUseCase.execute(companyId);
    return new UsageSummaryResponse(summary);
  }
}
