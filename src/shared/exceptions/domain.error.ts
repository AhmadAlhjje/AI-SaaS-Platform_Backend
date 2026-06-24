/**
 * Plain TS, zero NestJS imports — Domain layers in every module are allowed
 * to extend this (ROLE.md §19 forbids importing NestJS/Prisma in domain/application).
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
