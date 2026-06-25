import { IsIn, IsOptional } from 'class-validator';
import { Language, SUPPORTED_LANGUAGES } from '../../domain/value-objects/language.value-object';
import { Theme } from '../../domain/value-objects/theme.value-object';

export class UpdateSettingsDto {
  @IsOptional()
  @IsIn(Object.values(Theme))
  theme?: Theme;

  @IsOptional()
  @IsIn(SUPPORTED_LANGUAGES)
  language?: Language;
}
