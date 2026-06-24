import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

type RequestWithUser = Request & { user: AuthenticatedUser };

/**
 * Blocks requests with no tenant context at all (e.g. a user who never
 * created/joined a company). It does NOT check ownership of a specific
 * resource — that is a per-row concern and belongs to each module's Prisma
 * repository (`WHERE company_id = :companyId`), never to this shared guard.
 */
@Injectable()
export class CompanyOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user?.companyId) {
      throw new ForbiddenException('This action requires an active company context.');
    }

    return true;
  }
}
