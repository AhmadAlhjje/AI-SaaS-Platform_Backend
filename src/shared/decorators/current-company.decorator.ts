import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from './current-user.decorator';

type RequestWithUser = Request & { user: AuthenticatedUser };

/**
 * Resolves the tenant id strictly from the authenticated JWT context.
 * Per ROLE.md §10, company_id must never be trusted from the request body.
 */
export const CurrentCompany = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const companyId = request.user?.companyId;

    if (!companyId) {
      throw new UnauthorizedException('No company is associated with the current user.');
    }

    return companyId;
  },
);
