import { Injectable } from '@nestjs/common';
import { DataTableRow, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { DataTableRowEntity } from '../../domain/entities/data-table-row.entity';
import { QueryFilter, QueryPlan } from '../../domain/interfaces/sql-query-generator.interface';
import { DataTableRowRepository, RowQueryOptions } from '../../domain/repositories/data-table-row.repository';

@Injectable()
export class PrismaDataTableRowRepository implements DataTableRowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async query(dataTableId: string, plan: QueryPlan): Promise<DataTableRowEntity[]> {
    const records = await this.prisma.dataTableRow.findMany({
      where: {
        dataTableId,
        AND: plan.filters.map((filter) => this.toJsonFilter(filter)),
      },
      orderBy: { rowIndex: 'asc' },
      take: plan.limit,
    });

    return records.map((record) => this.toDomain(record));
  }

  async countByDataTableId(dataTableId: string): Promise<number> {
    return this.prisma.dataTableRow.count({ where: { dataTableId } });
  }

  async findPaginated(dataTableId: string, options: RowQueryOptions): Promise<DataTableRowEntity[]> {
    const records = await this.prisma.dataTableRow.findMany({
      where: this.toFilteredWhere(dataTableId, options),
      orderBy: { rowIndex: 'asc' },
      skip: options.skip,
      take: options.take,
    });

    return records.map((record) => this.toDomain(record));
  }

  async countFiltered(dataTableId: string, options: Omit<RowQueryOptions, 'skip' | 'take'>): Promise<number> {
    return this.prisma.dataTableRow.count({ where: this.toFilteredWhere(dataTableId, options) });
  }

  private toFilteredWhere(
    dataTableId: string,
    options: Omit<RowQueryOptions, 'skip' | 'take'>,
  ): Prisma.DataTableRowWhereInput {
    return {
      dataTableId,
      AND: options.filters.map((filter) => this.toJsonFilter(filter)),
      ...(options.search && options.searchableColumns.length > 0
        ? { OR: options.searchableColumns.map((column) => this.toSearchFilter(column, options.search!)) }
        : {}),
    };
  }

  private toSearchFilter(column: string, search: string): Prisma.DataTableRowWhereInput {
    return { rowData: { path: [column], string_contains: search } };
  }

  private toDomain(record: DataTableRow): DataTableRowEntity {
    return DataTableRowEntity.reconstitute({
      id: record.id,
      dataTableId: record.dataTableId,
      rowIndex: record.rowIndex,
      rowData: record.rowData as Record<string, unknown>,
      createdAt: record.createdAt,
    });
  }

  // Each branch maps to a Prisma JSON-path filter — always parameterized by
  // Prisma itself, never a string-built SQL fragment (ROLE.md §12).
  private toJsonFilter(filter: QueryFilter): Prisma.DataTableRowWhereInput {
    const path = [filter.column];

    switch (filter.operator) {
      case 'eq':
        return { rowData: { path, equals: filter.value as Prisma.InputJsonValue } };
      case 'neq':
        return { rowData: { path, not: filter.value as Prisma.InputJsonValue } };
      case 'gt':
        return { rowData: { path, gt: filter.value as number } };
      case 'gte':
        return { rowData: { path, gte: filter.value as number } };
      case 'lt':
        return { rowData: { path, lt: filter.value as number } };
      case 'lte':
        return { rowData: { path, lte: filter.value as number } };
      case 'contains':
        return { rowData: { path, string_contains: String(filter.value) } };
    }
  }
}
