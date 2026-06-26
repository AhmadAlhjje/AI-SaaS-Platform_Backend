import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { UserEntity } from '../../domain/entities/user.entity';
import { EmailAlreadyInUseError } from '../../domain/errors/email-already-in-use.error';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { PasswordHasher } from '../../domain/interfaces/password-hasher.interface';
import { UserRepository } from '../../domain/repositories/user.repository';

export interface ChangeEmailInput {
  readonly userId: string;
  readonly newEmail: string;
  readonly currentPassword: string;
}

/** Requires the current password — changing the login email is sensitive enough to re-verify identity (same bar as ChangePasswordUseCase). */
@Injectable()
export class ChangeEmailUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PROVIDER_TOKENS.PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: ChangeEmailInput): Promise<UserEntity> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    const isPasswordValid = await this.passwordHasher.compare(input.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const existing = await this.userRepository.findByEmail(input.newEmail);
    if (existing && existing.id !== user.id) {
      throw new EmailAlreadyInUseError(input.newEmail);
    }

    return this.userRepository.update(user.update({ email: input.newEmail }));
  }
}
