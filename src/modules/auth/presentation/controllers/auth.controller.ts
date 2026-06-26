import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../../../shared/decorators/current-user.decorator';
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
  AUTH_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
} from '../../../../shared/constants/cookie.constants';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import {
  AuthTokens,
  LoginUserUseCase,
} from '../../application/use-cases/login-user.use-case';
import { ChangeEmailUseCase } from '../../application/use-cases/change-email.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterDto } from '../dto/register.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { AuthTokenResponse } from '../responses/auth-token.response';
import { CurrentUserResponse } from '../responses/current-user.response';
import { RegisteredUserResponse } from '../responses/registered-user.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly changeEmailUseCase: ChangeEmailUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<RegisteredUserResponse> {
    const user = await this.registerUserUseCase.execute(dto);
    return new RegisteredUserResponse(user.id!, user.name, user.email);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokenResponse> {
    const tokens = await this.loginUserUseCase.execute(dto);
    this.setAuthCookies(res, tokens);
    return new AuthTokenResponse(tokens.accessToken, tokens.refreshToken);
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokenResponse> {
    const refreshToken =
      (req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined) ??
      dto.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    const tokens = await this.refreshTokenUseCase.execute({ refreshToken });
    this.setAuthCookies(res, tokens);
    return new AuthTokenResponse(tokens.accessToken, tokens.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response): { loggedOut: true } {
    res.clearCookie(ACCESS_TOKEN_COOKIE, AUTH_COOKIE_OPTIONS);
    res.clearCookie(REFRESH_TOKEN_COOKIE, AUTH_COOKIE_OPTIONS);
    return { loggedOut: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CurrentUserResponse> {
    const currentUser = await this.getCurrentUserUseCase.execute({
      userId: user.userId,
    });
    return new CurrentUserResponse(currentUser);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<CurrentUserResponse> {
    const updatedUser = await this.updateUserProfileUseCase.execute({ userId: user.userId, name: dto.name });
    return new CurrentUserResponse(updatedUser);
  }

  @Patch('me/email')
  @UseGuards(JwtAuthGuard)
  async changeEmail(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangeEmailDto,
  ): Promise<CurrentUserResponse> {
    const updatedUser = await this.changeEmailUseCase.execute({
      userId: user.userId,
      newEmail: dto.email,
      currentPassword: dto.currentPassword,
    });
    return new CurrentUserResponse(updatedUser);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async changePassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChangePasswordDto): Promise<void> {
    await this.changePasswordUseCase.execute({
      userId: user.userId,
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
  }

  private setAuthCookies(res: Response, tokens: AuthTokens): void {
    res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
    });
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
    });
  }
}
