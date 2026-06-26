import { DomainError } from "../../../../shared/exceptions/domain.error";

export class UserNotFoundError extends DomainError {
  readonly code = "USER_NOT_FOUND";
  readonly httpStatus = 404;

  constructor(userId: string) {
    super(`User ${userId} was not found.`);
  }
}
