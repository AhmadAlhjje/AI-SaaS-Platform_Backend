import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { QueryOperator } from '../../domain/interfaces/sql-query-generator.interface';

const OPERATORS: QueryOperator[] = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains'];

export class RowFilterDto {
  @IsString()
  @IsNotEmpty()
  column!: string;

  @IsIn(OPERATORS)
  operator!: QueryOperator;

  @IsNotEmpty()
  value!: string | number | boolean;
}
