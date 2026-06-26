import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { PasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { UserRepository } from '../../domain/repositories/user.repository';

export interface ChangePasswordInput {
  readonly userId: string;
  readonly currentPassword: string;
  readonly newPassword: string;
}

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PROVIDER_TOKENS.PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    const isPasswordValid = await this.passwordHasher.compare(input.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const newPasswordHash = await this.passwordHasher.hash(input.newPassword);
    await this.userRepository.update(user.update({ passwordHash: newPasswordHash }));
  }
}
