import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Optional because browser clients send the refresh token via the
 * httpOnly cookie instead — the body field exists for non-browser clients
 * (Postman, mobile) that authenticate with bearer tokens only.
 */
export class RefreshTokenDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  refreshToken?: string;
}
