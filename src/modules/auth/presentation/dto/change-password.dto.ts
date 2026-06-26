import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  // bcrypt silently truncates input past 72 bytes, so cap it explicitly.
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword!: string;
}
