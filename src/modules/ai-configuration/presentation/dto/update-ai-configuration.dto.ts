import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

const SUPPORTED_MODELS = ['gpt-4o-mini', 'gpt-4o', 'claude-haiku-4-5', 'claude-sonnet-4-6'];

export class UpdateAiConfigurationDto {
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  systemPrompt?: string;

  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_MODELS)
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8000)
  maxTokens?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  ragTopK?: number;
}
