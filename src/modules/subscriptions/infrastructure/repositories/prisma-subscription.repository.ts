import { Injectable } from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { SubscriptionStatus } from '../../domain/value-objects/subscription-status.value-object';

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveByCompanyId(companyId: string): Promise<SubscriptionEntity | null> {
    const record = await this.prisma.subscription.findFirst({
      where: {
        companyId,
        status: SubscriptionStatus.ACTIVE,
        OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
      },
      orderBy: { startDate: 'desc' },
    });

    return record ? this.toDomain(record) : null;
  }

  async create(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
    const record = await this.prisma.subscription.create({
      data: {
        companyId: subscription.companyId,
        planId: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    });

    return this.toDomain(record);
  }

  private toDomain(record: Subscription): SubscriptionEntity {
    return SubscriptionEntity.reconstitute({
      id: record.id,
      companyId: record.companyId,
      planId: record.planId,
      status: record.status as SubscriptionStatus,
      startDate: record.startDate,
      endDate: record.endDate,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
