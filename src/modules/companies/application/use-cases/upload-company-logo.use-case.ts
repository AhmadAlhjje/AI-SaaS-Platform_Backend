import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { StorageProvider } from '../../../../shared/interfaces/storage-provider.interface';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { CompanyNotFoundError } from '../../domain/errors/company-not-found.error';
import { UnsupportedLogoFileTypeError } from '../../domain/errors/unsupported-logo-file-type.error';
import { CompanyRepository } from '../../domain/repositories/company.repository';

const SUPPORTED_LOGO_FILE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);

export interface UploadCompanyLogoInput {
  readonly companyId: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly buffer: Buffer;
}

@Injectable()
export class UploadCompanyLogoUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.COMPANY_REPOSITORY) private readonly companyRepository: CompanyRepository,
    @Inject(PROVIDER_TOKENS.STORAGE_PROVIDER) private readonly storageProvider: StorageProvider,
  ) {}

  async execute(input: UploadCompanyLogoInput): Promise<CompanyEntity> {
    if (!SUPPORTED_LOGO_FILE_TYPES.has(input.fileType)) {
      throw new UnsupportedLogoFileTypeError(input.fileType);
    }

    const company = await this.companyRepository.findById(input.companyId);
    if (!company) {
      throw new CompanyNotFoundError(input.companyId);
    }

    const key = `company-logos/${input.companyId}/${randomUUID()}-${input.fileName}`;
    await this.storageProvider.upload({ key, buffer: input.buffer, contentType: input.fileType });
    const logoUrl = this.storageProvider.getPublicUrl(key);

    const updatedCompany = company.update({ logo: logoUrl });
    return this.companyRepository.update(updatedCompany);
  }
}
