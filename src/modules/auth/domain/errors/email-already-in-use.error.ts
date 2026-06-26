import { DomainError } from "../../../../shared/exceptions/domain.error";

export class EmailAlreadyInUseError extends DomainError {
  readonly code = "EMAIL_ALREADY_IN_USE";
  readonly httpStatus = 409;

  constructor(email: string) {
    super(`Email ${email} is already registered.`);
  }
}
