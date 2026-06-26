import { Inject, Injectable } from "@nestjs/common";
import {
  PROVIDER_TOKENS,
  REPOSITORY_TOKENS,
} from "../../../../shared/constants/tokens.constants";
import { EventBus } from "../../../../shared/events/event-bus";
import { UserEntity } from "../../domain/entities/user.entity";
import { EmailAlreadyInUseError } from "../../domain/errors/email-already-in-use.error";
import {
  USER_REGISTERED_EVENT,
  UserRegisteredEvent,
} from "../../domain/events/user-registered.event";
import { PasswordHasher } from "../../domain/interfaces/password-hasher.interface";
import { UserRepository } from "../../domain/repositories/user.repository";

export interface RegisterUserInput {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PROVIDER_TOKENS.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(input: RegisterUserInput): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError(input.email);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = UserEntity.register(input.name, input.email, passwordHash);
    const createdUser = await this.userRepository.create(user);

    this.eventBus.publish(
      USER_REGISTERED_EVENT,
      new UserRegisteredEvent(createdUser.id!, createdUser.email),
    );

    return createdUser;
  }
}
