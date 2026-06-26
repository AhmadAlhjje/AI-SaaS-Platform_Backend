import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  currentPassword!: string;
}
