import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { ListPlansUseCase } from '../../application/use-cases/list-plans.use-case';
import { PlanResponse } from '../responses/plan.response';

@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private readonly listPlansUseCase: ListPlansUseCase) {}

  @Get()
  async list(): Promise<PlanResponse[]> {
    const plans = await this.listPlansUseCase.execute();
    return plans.map((plan) => new PlanResponse(plan));
  }
}
