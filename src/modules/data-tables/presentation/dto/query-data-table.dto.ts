import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class QueryDataTableDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  question!: string;
}
