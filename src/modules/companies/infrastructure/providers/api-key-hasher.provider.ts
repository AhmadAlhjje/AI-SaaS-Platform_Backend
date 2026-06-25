import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ApiKeyHasher } from '../../domain/interfaces/api-key-hasher.interface';

/**
 * API keys are 256-bit random secrets, not low-entropy user passwords —
 * a fast deterministic digest is sufficient (and required, since lookups
 * by hash must be possible) instead of a slow salted hash like bcrypt.
 */
@Injectable()
export class ApiKeyHasherProvider implements ApiKeyHasher {
  hash(rawKey: string): string {
    return createHash('sha256').update(rawKey).digest('hex');
  }
}
