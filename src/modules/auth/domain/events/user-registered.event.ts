import { DomainEvent } from "../../../../shared/events/domain-event.interface";

export const USER_REGISTERED_EVENT = "user.registered";

export class UserRegisteredEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}
