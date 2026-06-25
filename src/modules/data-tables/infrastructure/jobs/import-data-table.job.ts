import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { PROVIDER_TOKENS } from '../../../../shared/constants/tokens.constants';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { ImportDataTableUseCase } from '../../application/use-cases/import-data-table.use-case';
import { DataTableFileDownloader } from '../../domain/interfaces/file-downloader.interface';
import { ImportDataTableJobData } from './job-data.types';

@Processor(QUEUE_NAMES.IMPORT_DATA_TABLE)
export class ImportDataTableJob extends WorkerHost {
  constructor(
    @Inject(PROVIDER_TOKENS.DATA_TABLE_FILE_DOWNLOADER) private readonly fileDownloader: DataTableFileDownloader,
    private readonly importDataTableUseCase: ImportDataTableUseCase,
  ) {
    super();
  }

  async process(job: Job<ImportDataTableJobData>): Promise<void> {
    const { documentId, companyId, fileName, fileType, fileKey } = job.data;
    const buffer = await this.fileDownloader.download(fileKey);

    await this.importDataTableUseCase.execute({ companyId, documentId, fileName, fileType, buffer });
  }
}
