import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { SUPPORTED_AI_MODELS } from '../../../../shared/constants/ai-models.constants';

export class TestPromptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  question!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  systemPrompt?: string;

  @IsString()
  @IsIn(SUPPORTED_AI_MODELS)
  model!: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  temperature!: number;

  @IsInt()
  @Min(1)
  @Max(8000)
  maxTokens!: number;
}
