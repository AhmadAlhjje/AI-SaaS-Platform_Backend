import { UsageSummary } from '../../application/use-cases/get-usage-summary.use-case';

export class UsageSummaryResponse {
  readonly documents: { readonly used: number; readonly limit: number };
  readonly dataTables: { readonly used: number; readonly limit: number };

  constructor(summary: UsageSummary) {
    this.documents = summary.documents;
    this.dataTables = summary.dataTables;
  }
}
