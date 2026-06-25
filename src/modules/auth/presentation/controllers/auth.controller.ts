import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthTokenResponse } from '../responses/auth-token.response';
import { RegisteredUserResponse } from '../responses/registered-user.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<RegisteredUserResponse> {
    const user = await this.registerUserUseCase.execute(dto);
    return new RegisteredUserResponse(user.id!, user.name, user.email);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthTokenResponse> {
    const tokens = await this.loginUserUseCase.execute(dto);
    return new AuthTokenResponse(tokens.accessToken, tokens.refreshToken);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokenResponse> {
    const tokens = await this.refreshTokenUseCase.execute(dto);
    return new AuthTokenResponse(tokens.accessToken, tokens.refreshToken);
  }
}
