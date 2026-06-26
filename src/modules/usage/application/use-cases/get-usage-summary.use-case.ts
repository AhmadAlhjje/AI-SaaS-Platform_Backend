import { Injectable } from '@nestjs/common';
import { GetDocumentUsageUseCase } from '../../../documents/application/use-cases/get-document-usage.use-case';
import { GetMySubscriptionUseCase } from '../../../subscriptions/application/use-cases/get-my-subscription.use-case';

export interface UsageSummaryResource {
  readonly used: number;
  readonly limit: number;
}

export interface UsageSummary {
  readonly documents: UsageSummaryResource;
  readonly dataTables: UsageSummaryResource;
}

/**
 * Sits above Documents and Subscriptions purely to combine their public
 * use-cases — neither module may depend on the other directly (Documents
 * already imports Subscriptions for CheckUsageLimitsUseCase, so the reverse
 * import would cycle).
 */
@Injectable()
export class GetUsageSummaryUseCase {
  constructor(
    private readonly getMySubscriptionUseCase: GetMySubscriptionUseCase,
    private readonly getDocumentUsageUseCase: GetDocumentUsageUseCase,
  ) {}

  async execute(companyId: string): Promise<UsageSummary> {
    const [{ plan }, usage] = await Promise.all([
      this.getMySubscriptionUseCase.execute({ companyId }),
      this.getDocumentUsageUseCase.execute(companyId),
    ]);

    return {
      documents: { used: usage.documentsUsed, limit: plan.limits.maxDocuments },
      dataTables: { used: usage.dataTablesUsed, limit: plan.limits.maxDataTables },
    };
  }
}
