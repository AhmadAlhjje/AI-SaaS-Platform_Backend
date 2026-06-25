import { IsIn } from 'class-validator';
import { Theme } from '../../domain/value-objects/theme.value-object';

export class UpdateThemeDto {
  @IsIn(Object.values(Theme))
  theme!: Theme;
}
