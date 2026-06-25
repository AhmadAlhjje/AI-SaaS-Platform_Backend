import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CompanyNotFoundError } from '../../domain/errors/company-not-found.error';
import { CompanyRepository } from '../../domain/repositories/company.repository';

export interface GetCompanyProfileInput {
  readonly userId: string;
}

@Injectable()
export class GetCompanyProfileUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.COMPANY_REPOSITORY) private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(input: GetCompanyProfileInput): Promise<CompanyEntity> {
    const company = await this.companyRepository.findByUserId(input.userId);
    if (!company) {
      throw new CompanyNotFoundError(input.userId);
    }

    return company;
  }
}
