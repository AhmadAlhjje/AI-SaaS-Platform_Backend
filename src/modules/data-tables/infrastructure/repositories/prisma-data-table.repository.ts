import { Injectable } from '@nestjs/common';
import { DataTable, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { DataTableEntity } from '../../domain/entities/data-table.entity';
import { DataTableRepository } from '../../domain/repositories/data-table.repository';
import { ColumnSchema } from '../../domain/value-objects/column-schema.value-object';

@Injectable()
export class PrismaDataTableRepository implements DataTableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<DataTableEntity | null> {
    const record = await this.prisma.dataTable.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findAllByCompanyId(companyId: string): Promise<DataTableEntity[]> {
    const records = await this.prisma.dataTable.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => this.toDomain(record));
  }

  async createWithRows(dataTable: DataTableEntity, rows: readonly Record<string, unknown>[]): Promise<DataTableEntity> {
    const record = await this.prisma.$transaction(async (tx) => {
      const created = await tx.dataTable.create({
        data: {
          companyId: dataTable.companyId,
          documentId: dataTable.documentId,
          tableName: dataTable.tableName,
          schemaJson: dataTable.columns as unknown as Prisma.InputJsonValue,
        },
      });

      if (rows.length > 0) {
        await tx.dataTableRow.createMany({
          data: rows.map((rowData, index) => ({
            dataTableId: created.id,
            rowIndex: index,
            rowData: rowData as Prisma.InputJsonValue,
          })),
        });
      }

      return created;
    });

    return this.toDomain(record);
  }

  private toDomain(record: DataTable): DataTableEntity {
    return DataTableEntity.reconstitute({
      id: record.id,
      companyId: record.companyId,
      documentId: record.documentId,
      tableName: record.tableName,
      columns: record.schemaJson as unknown as ColumnSchema[],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
