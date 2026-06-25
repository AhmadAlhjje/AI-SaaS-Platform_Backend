import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CompanyNotFoundError } from '../../domain/errors/company-not-found.error';
import { CompanyRepository } from '../../domain/repositories/company.repository';

export interface UpdateCompanyInput {
  readonly companyId: string;
  readonly name?: string;
  readonly logo?: string | null;
}

@Injectable()
export class UpdateCompanyUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.COMPANY_REPOSITORY) private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(input: UpdateCompanyInput): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(input.companyId);
    if (!company) {
      throw new CompanyNotFoundError(input.companyId);
    }

    const updatedCompany = company.update({ name: input.name, logo: input.logo });
    return this.companyRepository.update(updatedCompany);
  }
}
