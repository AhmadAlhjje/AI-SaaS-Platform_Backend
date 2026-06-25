import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from '../../../../shared/constants/queue.constants';
import { PDF_FILE_TYPE } from '../../domain/entities/document.entity';
import { DOCUMENT_UPLOADED_EVENT, DocumentUploadedEvent } from '../../domain/events/document-uploaded.event';
import { ParsePdfJobData } from '../../infrastructure/jobs/job-data.types';

/**
 * ROLE.md §14 example flow: UploadDocumentUseCase → DocumentUploadedEvent →
 * (this handler) → ParsePdfJob, the first stage of the RAG pipeline.
 * Only PDFs are unstructured-knowledge candidates — CSV/Excel go through
 * the Step 7 Data Tables / SQL Agent path instead, not RAG.
 */
@Injectable()
export class EnqueueDocumentProcessingHandler {
  constructor(@InjectQueue(QUEUE_NAMES.PARSE_PDF) private readonly parsePdfQueue: Queue<ParsePdfJobData>) {}

  @OnEvent(DOCUMENT_UPLOADED_EVENT)
  async handle(event: DocumentUploadedEvent): Promise<void> {
    if (event.fileType !== PDF_FILE_TYPE) {
      return;
    }

    await this.parsePdfQueue.add(QUEUE_NAMES.PARSE_PDF, {
      documentId: event.documentId,
      companyId: event.companyId,
      fileKey: event.fileUrl,
    });
  }
}
