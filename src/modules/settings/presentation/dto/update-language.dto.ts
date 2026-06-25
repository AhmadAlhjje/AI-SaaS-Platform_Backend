import { IsIn } from 'class-validator';
import { Language, SUPPORTED_LANGUAGES } from '../../domain/value-objects/language.value-object';

export class UpdateLanguageDto {
  @IsIn(SUPPORTED_LANGUAGES)
  language!: Language;
}
