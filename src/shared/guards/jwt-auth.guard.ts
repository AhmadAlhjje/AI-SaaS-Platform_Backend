import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Delegates to the 'jwt' Passport strategy registered by the auth module.
 * Populates request.user with AuthenticatedUser on success.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
