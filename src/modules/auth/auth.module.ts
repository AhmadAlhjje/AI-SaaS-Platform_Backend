import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { BcryptPasswordHasherProvider } from './infrastructure/providers/bcrypt-password-hasher.provider';
import { JwtTokenProvider } from './infrastructure/providers/jwt-token.provider';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    JwtStrategy,
    { provide: REPOSITORY_TOKENS.USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PROVIDER_TOKENS.PASSWORD_HASHER, useClass: BcryptPasswordHasherProvider },
    { provide: PROVIDER_TOKENS.TOKEN_PROVIDER, useClass: JwtTokenProvider },
  ],
})
export class AuthModule {}
