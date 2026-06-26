import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { ActivateSubscriptionUseCase } from '../../application/use-cases/activate-subscription.use-case';
import { GetMySubscriptionUseCase } from '../../application/use-cases/get-my-subscription.use-case';
import { ActivateSubscriptionDto } from '../dto/activate-subscription.dto';
import { SubscriptionResponse } from '../responses/subscription.response';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class SubscriptionsController {
  constructor(
    private readonly getMySubscriptionUseCase: GetMySubscriptionUseCase,
    private readonly activateSubscriptionUseCase: ActivateSubscriptionUseCase,
  ) {}

  @Get('me')
  async getMySubscription(@CurrentCompany() companyId: string): Promise<SubscriptionResponse> {
    const { subscription, plan } = await this.getMySubscriptionUseCase.execute({ companyId });
    return new SubscriptionResponse(subscription, plan);
  }

  @Post('me/change-plan')
  async changePlan(
    @CurrentCompany() companyId: string,
    @Body() dto: ActivateSubscriptionDto,
  ): Promise<SubscriptionResponse> {
    await this.activateSubscriptionUseCase.execute({ companyId, planId: dto.planId });
    const { subscription, plan } = await this.getMySubscriptionUseCase.execute({ companyId });
    return new SubscriptionResponse(subscription, plan);
  }
}
