import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { DataTableEntity } from '../../domain/entities/data-table.entity';
import { DataTableRepository } from '../../domain/repositories/data-table.repository';

export interface ListDataTablesInput {
  readonly companyId: string;
}

@Injectable()
export class ListDataTablesUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY) private readonly dataTableRepository: DataTableRepository) {}

  execute(input: ListDataTablesInput): Promise<DataTableEntity[]> {
    return this.dataTableRepository.findAllByCompanyId(input.companyId);
  }
}
