import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { JwtPayload, TokenProvider } from '../../domain/interfaces/token-provider.interface';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthTokens } from './login-user.use-case';

export interface RefreshTokenInput {
  readonly refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PROVIDER_TOKENS.TOKEN_PROVIDER) private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(input: RefreshTokenInput): Promise<AuthTokens> {
    const payload = this.tokenProvider.verifyRefreshToken(input.refreshToken);

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UserNotFoundError(payload.sub);
    }

    const freshPayload: JwtPayload = { sub: user.id!, companyId: user.companyId };

    return {
      accessToken: this.tokenProvider.signAccessToken(freshPayload),
      refreshToken: this.tokenProvider.signRefreshToken(freshPayload),
    };
  }
}
