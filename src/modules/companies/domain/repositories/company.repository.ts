import { CompanyEntity } from '../entities/company.entity';

export interface CompanyRepository {
  findById(id: string): Promise<CompanyEntity | null>;
  findByUserId(userId: string): Promise<CompanyEntity | null>;
  create(company: CompanyEntity): Promise<CompanyEntity>;
  update(company: CompanyEntity): Promise<CompanyEntity>;
}
