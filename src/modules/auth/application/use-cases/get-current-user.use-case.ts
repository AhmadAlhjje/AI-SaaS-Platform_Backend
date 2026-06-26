import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserRepository } from '../../domain/repositories/user.repository';

export interface GetCurrentUserInput {
  readonly userId: string;
}

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: GetCurrentUserInput): Promise<UserEntity> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new UserNotFoundError(input.userId);
    }

    return user;
  }
}
