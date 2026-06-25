import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { CreateApiKeyUseCase } from '../../application/use-cases/create-api-key.use-case';
import { ListApiKeysUseCase } from '../../application/use-cases/list-api-keys.use-case';
import { RevokeApiKeyUseCase } from '../../application/use-cases/revoke-api-key.use-case';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { ApiKeyResponse } from '../responses/api-key.response';

@Controller('companies/me/api-keys')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class ApiKeysController {
  constructor(
    private readonly createApiKeyUseCase: CreateApiKeyUseCase,
    private readonly listApiKeysUseCase: ListApiKeysUseCase,
    private readonly revokeApiKeyUseCase: RevokeApiKeyUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentCompany() companyId: string, @Body() dto: CreateApiKeyDto): Promise<ApiKeyResponse> {
    const { apiKey, rawKey } = await this.createApiKeyUseCase.execute({ companyId, name: dto.name });
    return new ApiKeyResponse(apiKey, rawKey);
  }

  @Get()
  async list(@CurrentCompany() companyId: string): Promise<ApiKeyResponse[]> {
    const apiKeys = await this.listApiKeysUseCase.execute({ companyId });
    return apiKeys.map((apiKey) => new ApiKeyResponse(apiKey));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(@CurrentCompany() companyId: string, @Param('id') apiKeyId: string): Promise<void> {
    await this.revokeApiKeyUseCase.execute({ apiKeyId, companyId });
  }
}
