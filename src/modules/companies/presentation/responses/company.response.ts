import { CompanyEntity } from '../../domain/entities/company.entity';

export class CompanyResponse {
  readonly id: string;
  readonly name: string;
  readonly logo: string | null;
  readonly contactEmail: string | null;
  readonly contactPhone: string | null;
  readonly address: string | null;
  readonly website: string | null;
  readonly status: string;
  readonly createdAt: Date;

  constructor(company: CompanyEntity) {
    this.id = company.id!;
    this.name = company.name;
    this.logo = company.logo;
    this.contactEmail = company.contactEmail;
    this.contactPhone = company.contactPhone;
    this.address = company.address;
    this.website = company.website;
    this.status = company.status;
    this.createdAt = company.createdAt;
  }
}
