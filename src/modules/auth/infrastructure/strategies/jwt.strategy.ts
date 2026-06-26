import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from '../../../../infrastructure/config/app.config';
import { AuthenticatedUser } from '../../../../shared/decorators/current-user.decorator';
import { ACCESS_TOKEN_COOKIE } from '../../../../shared/constants/cookie.constants';
import { JwtPayload } from '../../domain/interfaces/token-provider.interface';

function accessTokenCookieExtractor(req: Request): string | null {
  return (req?.cookies?.[ACCESS_TOKEN_COOKIE] as string | undefined) ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        accessTokenCookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<AppConfig['jwtSecret']>('app.jwtSecret')!,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { userId: payload.sub, companyId: payload.companyId };
  }
}
