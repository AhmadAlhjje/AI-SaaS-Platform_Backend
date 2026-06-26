import { DomainError } from "../../../../shared/exceptions/domain.error";

/**
 * Used for both "no such user" and "wrong password" so the API never
 * reveals which case applies (avoids email-enumeration).
 */
export class InvalidCredentialsError extends DomainError {
  readonly code = "INVALID_CREDENTIALS";
  readonly httpStatus = 401;

  constructor() {
    super("Invalid email or password.");
  }
}
