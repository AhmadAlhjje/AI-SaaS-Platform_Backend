import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { GetMySubscriptionUseCase } from '../../application/use-cases/get-my-subscription.use-case';
import { SubscriptionResponse } from '../responses/subscription.response';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class SubscriptionsController {
  constructor(private readonly getMySubscriptionUseCase: GetMySubscriptionUseCase) {}

  @Get('me')
  async getMySubscription(@CurrentCompany() companyId: string): Promise<SubscriptionResponse> {
    const { subscription, plan } = await this.getMySubscriptionUseCase.execute({ companyId });
    return new SubscriptionResponse(subscription, plan);
  }
}
