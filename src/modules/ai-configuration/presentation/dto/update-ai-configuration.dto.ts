import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { SUPPORTED_AI_MODELS } from '../../../../shared/constants/ai-models.constants';

export class UpdateAiConfigurationDto {
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  systemPrompt?: string;

  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_AI_MODELS)
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
