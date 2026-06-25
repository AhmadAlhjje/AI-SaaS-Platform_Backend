import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

type UserWithCompany = User & { company: { id: string } | null };

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findFirst({
      where: { email: email.trim().toLowerCase(), deletedAt: null },
      include: { company: { select: { id: true } } },
    });

    return record ? this.toDomain(record) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { company: { select: { id: true } } },
    });

    return record ? this.toDomain(record) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const record = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
      },
    });

    return UserEntity.reconstitute({
      id: record.id,
      name: record.name,
      email: record.email,
      passwordHash: record.passwordHash,
      companyId: null,
      createdAt: record.createdAt,
    });
  }

  private toDomain(record: UserWithCompany): UserEntity {
    return UserEntity.reconstitute({
      id: record.id,
      name: record.name,
      email: record.email,
      passwordHash: record.passwordHash,
      companyId: record.company?.id ?? null,
      createdAt: record.createdAt,
    });
  }
}
