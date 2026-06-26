import { Inject, Injectable } from "@nestjs/common";
import {
  PROVIDER_TOKENS,
  REPOSITORY_TOKENS,
} from "../../../../shared/constants/tokens.constants";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import {
  JwtPayload,
  TokenProvider,
} from "../../domain/interfaces/token-provider.interface";
import { PasswordHasher } from "../../domain/interfaces/password-hasher.interface";
import { UserRepository } from "../../domain/repositories/user.repository";

export interface LoginUserInput {
  readonly email: string;
  readonly password: string;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PROVIDER_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(PROVIDER_TOKENS.TOKEN_PROVIDER)
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(input: LoginUserInput): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const payload: JwtPayload = { sub: user.id!, companyId: user.companyId };

    return {
      accessToken: this.tokenProvider.signAccessToken(payload),
      refreshToken: this.tokenProvider.signRefreshToken(payload),
    };
  }
}
