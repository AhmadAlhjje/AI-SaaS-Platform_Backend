import { CompanyEntity } from '../../domain/entities/company.entity';

export class CompanyResponse {
  readonly id: string;
  readonly name: string;
  readonly logo: string | null;
  readonly status: string;
  readonly createdAt: Date;

  constructor(company: CompanyEntity) {
    this.id = company.id!;
    this.name = company.name;
    this.logo = company.logo;
    this.status = company.status;
    this.createdAt = company.createdAt;
  }
}
