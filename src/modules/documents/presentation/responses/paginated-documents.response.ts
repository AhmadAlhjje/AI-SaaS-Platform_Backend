import { ListDocumentsResult } from '../../application/use-cases/list-documents.use-case';
import { DocumentResponse } from './document.response';

export class PaginatedDocumentsResponse {
  readonly items: DocumentResponse[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;

  constructor(result: ListDocumentsResult) {
    this.items = result.items.map((document) => new DocumentResponse(document));
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }
}
