import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website?: string;
}
