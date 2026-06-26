import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { DataTableEntity } from '../../domain/entities/data-table.entity';
import { DataTableNotFoundError } from '../../domain/errors/data-table-not-found.error';
import { DataTableRepository } from '../../domain/repositories/data-table.repository';
import { DataTableRowRepository } from '../../domain/repositories/data-table-row.repository';

export interface GetDataTableSchemaInput {
  readonly dataTableId: string;
  readonly companyId: string;
}

export interface GetDataTableSchemaResult {
  readonly dataTable: DataTableEntity;
  readonly rowCount: number;
}

@Injectable()
export class GetDataTableSchemaUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY) private readonly dataTableRepository: DataTableRepository,
    @Inject(REPOSITORY_TOKENS.DATA_TABLE_ROW_REPOSITORY) private readonly dataTableRowRepository: DataTableRowRepository,
  ) {}

  async execute(input: GetDataTableSchemaInput): Promise<GetDataTableSchemaResult> {
    const dataTable = await this.dataTableRepository.findById(input.dataTableId);

    if (!dataTable || dataTable.companyId !== input.companyId) {
      throw new DataTableNotFoundError(input.dataTableId);
    }

    const rowCount = await this.dataTableRowRepository.countByDataTableId(dataTable.id!);

    return { dataTable, rowCount };
  }
}
