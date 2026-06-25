import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EventBus } from '../../../../shared/events/event-bus';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CompanyAlreadyExistsError } from '../../domain/errors/company-already-exists.error';
import { COMPANY_CREATED_EVENT, CompanyCreatedEvent } from '../../domain/events/company-created.event';
import { CompanyRepository } from '../../domain/repositories/company.repository';

export interface CreateCompanyInput {
  readonly userId: string;
  readonly name: string;
  readonly logo?: string | null;
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.COMPANY_REPOSITORY) private readonly companyRepository: CompanyRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: CreateCompanyInput): Promise<CompanyEntity> {
    const existingCompany = await this.companyRepository.findByUserId(input.userId);
    if (existingCompany) {
      throw new CompanyAlreadyExistsError(input.userId);
    }

    const company = CompanyEntity.create(input.userId, input.name, input.logo ?? null);
    const createdCompany = await this.companyRepository.create(company);

    this.eventBus.publish(COMPANY_CREATED_EVENT, new CompanyCreatedEvent(createdCompany.id!, createdCompany.userId));

    return createdCompany;
  }
}
