import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { RowFilterDto } from './row-filter.dto';

/** `filters` arrives as a JSON-encoded array since GET query strings can't carry nested objects. */
function parseFilters({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export class GetDataTableRowsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @Transform(parseFilters)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RowFilterDto)
  filters?: RowFilterDto[];
}
