import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAMES } from '../../shared/constants/queue.constants';
import { PROVIDER_TOKENS, REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { EnqueueDataImportHandler } from './application/event-handlers/enqueue-data-import.handler';
import { ExecuteSqlQueryUseCase } from './application/use-cases/execute-sql-query.use-case';
import { GenerateSqlQueryUseCase } from './application/use-cases/generate-sql-query.use-case';
import { GetDataTableSchemaUseCase } from './application/use-cases/get-data-table-schema.use-case';
import { ImportDataTableUseCase } from './application/use-cases/import-data-table.use-case';
import { ListDataTablesUseCase } from './application/use-cases/list-data-tables.use-case';
import { ImportDataTableJob } from './infrastructure/jobs/import-data-table.job';
import { CsvParserProvider } from './infrastructure/providers/csv-parser.provider';
import { ExcelParserProvider } from './infrastructure/providers/excel-parser.provider';
import { HeuristicSqlQueryGeneratorProvider } from './infrastructure/providers/heuristic-sql-query-generator.provider';
import { S3DataTableDownloaderProvider } from './infrastructure/providers/s3-data-table-downloader.provider';
import { PrismaDataTableRowRepository } from './infrastructure/repositories/prisma-data-table-row.repository';
import { PrismaDataTableRepository } from './infrastructure/repositories/prisma-data-table.repository';
import { DataTablesController } from './presentation/controllers/data-tables.controller';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAMES.IMPORT_DATA_TABLE })],
  controllers: [DataTablesController],
  providers: [
    ImportDataTableUseCase,
    ListDataTablesUseCase,
    GetDataTableSchemaUseCase,
    GenerateSqlQueryUseCase,
    ExecuteSqlQueryUseCase,
    EnqueueDataImportHandler,
    ImportDataTableJob,
    { provide: REPOSITORY_TOKENS.DATA_TABLE_REPOSITORY, useClass: PrismaDataTableRepository },
    { provide: REPOSITORY_TOKENS.DATA_TABLE_ROW_REPOSITORY, useClass: PrismaDataTableRowRepository },
    { provide: PROVIDER_TOKENS.CSV_PARSER, useClass: CsvParserProvider },
    { provide: PROVIDER_TOKENS.EXCEL_PARSER, useClass: ExcelParserProvider },
    { provide: PROVIDER_TOKENS.DATA_TABLE_FILE_DOWNLOADER, useClass: S3DataTableDownloaderProvider },
    { provide: PROVIDER_TOKENS.SQL_QUERY_GENERATOR, useClass: HeuristicSqlQueryGeneratorProvider },
  ],
})
export class DataTablesModule {}
