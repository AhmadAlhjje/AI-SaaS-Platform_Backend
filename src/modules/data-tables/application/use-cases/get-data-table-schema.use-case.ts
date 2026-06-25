import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { DataTableEntity } from '../../domain/entities/data-table.entity';
import { DataTableNotFoundError } from '../../domain/errors/data-table-not-found.error';
import { DataTableRepository } from '../../domain/repositories/data-table.repository';

export interface GetDataTableSchemaInput {
  readonly dataTableId: string;
  readonly companyId: string;
}

@Injectable()
export class GetDataTableSchemaUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY) private readonly dataTableRepository: DataTableRepository) {}

  async execute(input: GetDataTableSchemaInput): Promise<DataTableEntity> {
    const dataTable = await this.dataTableRepository.findById(input.dataTableId);

    if (!dataTable || dataTable.companyId !== input.companyId) {
      throw new DataTableNotFoundError(input.dataTableId);
    }

    return dataTable;
  }
}
