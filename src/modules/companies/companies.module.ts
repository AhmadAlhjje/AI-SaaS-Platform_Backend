import { Module } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { CreateApiKeyUseCase } from './application/use-cases/create-api-key.use-case';
import { CreateCompanyUseCase } from './application/use-cases/create-company.use-case';
import { GetCompanyProfileUseCase } from './application/use-cases/get-company-profile.use-case';
import { ListApiKeysUseCase } from './application/use-cases/list-api-keys.use-case';
import { RevokeApiKeyUseCase } from './application/use-cases/revoke-api-key.use-case';
import { SuspendCompanyUseCase } from './application/use-cases/suspend-company.use-case';
import { UpdateCompanyUseCase } from './application/use-cases/update-company.use-case';
import { ApiKeyHasherProvider } from './infrastructure/providers/api-key-hasher.provider';
import { PrismaApiKeyRepository } from './infrastructure/repositories/prisma-api-key.repository';
import { PrismaCompanyRepository } from './infrastructure/repositories/prisma-company.repository';
import { ApiKeysController } from './presentation/controllers/api-keys.controller';
import { CompaniesController } from './presentation/controllers/companies.controller';

@Module({
  controllers: [CompaniesController, ApiKeysController],
  providers: [
    CreateCompanyUseCase,
    GetCompanyProfileUseCase,
    UpdateCompanyUseCase,
    SuspendCompanyUseCase,
    CreateApiKeyUseCase,
    ListApiKeysUseCase,
    RevokeApiKeyUseCase,
    { provide: REPOSITORY_TOKENS.COMPANY_REPOSITORY, useClass: PrismaCompanyRepository },
    { provide: REPOSITORY_TOKENS.API_KEY_REPOSITORY, useClass: PrismaApiKeyRepository },
    { provide: PROVIDER_TOKENS.API_KEY_HASHER, useClass: ApiKeyHasherProvider },
  ],
})
export class CompaniesModule {}
