import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { AuthenticatedUser, CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { CreateCompanyUseCase } from '../../application/use-cases/create-company.use-case';
import { GetCompanyProfileUseCase } from '../../application/use-cases/get-company-profile.use-case';
import { SuspendCompanyUseCase } from '../../application/use-cases/suspend-company.use-case';
import { UpdateCompanyUseCase } from '../../application/use-cases/update-company.use-case';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyResponse } from '../responses/company.response';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly getCompanyProfileUseCase: GetCompanyProfileUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
    private readonly suspendCompanyUseCase: SuspendCompanyUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCompanyDto): Promise<CompanyResponse> {
    const company = await this.createCompanyUseCase.execute({ userId: user.userId, ...dto });
    return new CompanyResponse(company);
  }

  @Get('me')
  async getMyProfile(@CurrentUser() user: AuthenticatedUser): Promise<CompanyResponse> {
    const company = await this.getCompanyProfileUseCase.execute({ userId: user.userId });
    return new CompanyResponse(company);
  }

  @Patch('me')
  @UseGuards(CompanyOwnershipGuard)
  async updateMyCompany(
    @CurrentCompany() companyId: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<CompanyResponse> {
    const company = await this.updateCompanyUseCase.execute({ companyId, ...dto });
    return new CompanyResponse(company);
  }

  @Patch('me/suspend')
  @UseGuards(CompanyOwnershipGuard)
  async suspendMyCompany(@CurrentCompany() companyId: string): Promise<CompanyResponse> {
    const company = await this.suspendCompanyUseCase.execute({ companyId });
    return new CompanyResponse(company);
  }
}
