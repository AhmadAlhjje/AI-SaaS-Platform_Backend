import { UserEntity } from '../../domain/entities/user.entity';

/**
 * The schema has no role concept yet — every registered user is a company
 * owner, so the role is reported as a fixed constant for the frontend's
 * authorization checks rather than read from the database.
 */
export class CurrentUserResponse {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly companyId: string | null;
  readonly role: string;

  constructor(user: UserEntity) {
    this.id = user.id!;
    this.name = user.name;
    this.email = user.email;
    this.companyId = user.companyId;
    this.role = 'COMPANY_OWNER';
  }
}
