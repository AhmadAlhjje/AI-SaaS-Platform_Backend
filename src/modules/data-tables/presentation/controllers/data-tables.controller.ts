import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { ExecuteSqlQueryUseCase } from '../../application/use-cases/execute-sql-query.use-case';
import { GenerateSqlQueryUseCase } from '../../application/use-cases/generate-sql-query.use-case';
import { GetDataTableSchemaUseCase } from '../../application/use-cases/get-data-table-schema.use-case';
import { ListDataTablesUseCase } from '../../application/use-cases/list-data-tables.use-case';
import { QueryDataTableDto } from '../dto/query-data-table.dto';
import { DataTableResponse } from '../responses/data-table.response';
import { QueryResultResponse } from '../responses/query-result.response';

@Controller('data-tables')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class DataTablesController {
  constructor(
    private readonly listDataTablesUseCase: ListDataTablesUseCase,
    private readonly getDataTableSchemaUseCase: GetDataTableSchemaUseCase,
    private readonly generateSqlQueryUseCase: GenerateSqlQueryUseCase,
    private readonly executeSqlQueryUseCase: ExecuteSqlQueryUseCase,
  ) {}

  @Get()
  async list(@CurrentCompany() companyId: string): Promise<DataTableResponse[]> {
    const dataTables = await this.listDataTablesUseCase.execute({ companyId });
    return dataTables.map((dataTable) => new DataTableResponse(dataTable));
  }

  @Get(':id/schema')
  async getSchema(@CurrentCompany() companyId: string, @Param('id') dataTableId: string): Promise<DataTableResponse> {
    const dataTable = await this.getDataTableSchemaUseCase.execute({ dataTableId, companyId });
    return new DataTableResponse(dataTable);
  }

  @Post(':id/query')
  async query(
    @CurrentCompany() companyId: string,
    @Param('id') dataTableId: string,
    @Body() dto: QueryDataTableDto,
  ): Promise<QueryResultResponse> {
    const plan = await this.generateSqlQueryUseCase.execute({ dataTableId, companyId, question: dto.question });
    const result = await this.executeSqlQueryUseCase.execute({ dataTableId, companyId, plan });
    return new QueryResultResponse(result);
  }
}
