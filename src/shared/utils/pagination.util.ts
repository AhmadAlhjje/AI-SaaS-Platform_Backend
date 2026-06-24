export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
}

export interface PaginatedResult<TItem> {
  readonly items: TItem[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function toPrismaSkipTake(params: PaginationParams): {
  skip: number;
  take: number;
  page: number;
  limit: number;
} {
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const limit = Math.min(Math.max(params.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

  return { skip: (page - 1) * limit, take: limit, page, limit };
}

export function toPaginatedResult<TItem>(
  items: TItem[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<TItem> {
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}
