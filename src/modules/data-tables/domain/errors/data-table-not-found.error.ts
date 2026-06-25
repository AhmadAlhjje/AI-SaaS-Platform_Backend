import { DomainError } from '../../../../shared/exceptions/domain.error';

export class DataTableNotFoundError extends DomainError {
  readonly code = 'DATA_TABLE_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(dataTableId: string) {
    super(`Data table ${dataTableId} was not found.`);
  }
}
