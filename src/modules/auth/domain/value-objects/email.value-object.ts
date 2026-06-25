const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Format is also checked by class-validator at the presentation layer;
 * this re-checks at the domain boundary so UserEntity can never hold an
 * invalid email regardless of caller.
 */
export class Email {
  private readonly value: string;

  constructor(rawValue: string) {
    const normalized = rawValue.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalized)) {
      throw new Error(`Invalid email format: ${rawValue}`);
    }

    this.value = normalized;
  }

  toString(): string {
    return this.value;
  }
}
