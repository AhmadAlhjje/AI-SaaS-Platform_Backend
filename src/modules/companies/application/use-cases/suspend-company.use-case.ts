import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CompanyNotFoundError } from '../../domain/errors/company-not-found.error';
import { COMPANY_SUSPENDED_EVENT, CompanySuspendedEvent } from '../../domain/events/company-suspended.event';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { EventBus } from '../../../../shared/events/event-bus';

export interface SuspendCompanyInput {
  readonly companyId: string;
}

@Injectable()
export class SuspendCompanyUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.COMPANY_REPOSITORY) private readonly companyRepository: CompanyRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: SuspendCompanyInput): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(input.companyId);
    if (!company) {
      throw new CompanyNotFoundError(input.companyId);
    }

    const suspendedCompany = await this.companyRepository.update(company.suspend());
    this.eventBus.publish(COMPANY_SUSPENDED_EVENT, new CompanySuspendedEvent(suspendedCompany.id!));

    return suspendedCompany;
  }
}
