import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../../../infrastructure/config/app.config';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { JwtPayload, TokenProvider } from '../../domain/interfaces/token-provider.interface';

@Injectable()
export class JwtTokenProvider implements TokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<AppConfig['jwtSecret']>('app.jwtSecret'),
      expiresIn: this.configService.get<AppConfig['jwtExpiresIn']>('app.jwtExpiresIn'),
    });
  }

  signRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<AppConfig['jwtRefreshSecret']>('app.jwtRefreshSecret'),
      expiresIn: this.configService.get<AppConfig['jwtRefreshExpiresIn']>('app.jwtRefreshExpiresIn'),
    });
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<AppConfig['jwtRefreshSecret']>('app.jwtRefreshSecret'),
      });
    } catch {
      throw new InvalidCredentialsError();
    }
  }
}
