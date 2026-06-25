import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  email!: string;

  // bcrypt silently truncates input past 72 bytes, so cap it explicitly.
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
