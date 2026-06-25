import { Injectable } from '@nestjs/common';
import { Plan } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { PlanEntity } from '../../domain/entities/plan.entity';
import { PlanRepository } from '../../domain/repositories/plan.repository';
import { PlanLimits } from '../../domain/value-objects/plan-limits.value-object';

@Injectable()
export class PrismaPlanRepository implements PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PlanEntity | null> {
    const record = await this.prisma.plan.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByName(name: string): Promise<PlanEntity | null> {
    const record = await this.prisma.plan.findUnique({ where: { name } });
    return record ? this.toDomain(record) : null;
  }

  private toDomain(record: Plan): PlanEntity {
    return PlanEntity.reconstitute({
      id: record.id,
      name: record.name,
      price: record.price.toNumber(),
      limits: record.limitsJson as unknown as PlanLimits,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
