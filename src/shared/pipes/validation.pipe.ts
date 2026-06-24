import { ValidationPipe } from '@nestjs/common';

/**
 * Project-wide defaults: strips unknown DTO fields, rejects extras instead
 * of silently dropping them, and coerces primitives (e.g. query "1" -> 1).
 */
export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    });
  }
}
