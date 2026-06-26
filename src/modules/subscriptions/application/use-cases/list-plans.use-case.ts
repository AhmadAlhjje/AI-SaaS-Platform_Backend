import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { PlanEntity } from '../../domain/entities/plan.entity';
import { PlanRepository } from '../../domain/repositories/plan.repository';

@Injectable()
export class ListPlansUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.PLAN_REPOSITORY) private readonly planRepository: PlanRepository) {}

  execute(): Promise<PlanEntity[]> {
    return this.planRepository.findAll();
  }
}
