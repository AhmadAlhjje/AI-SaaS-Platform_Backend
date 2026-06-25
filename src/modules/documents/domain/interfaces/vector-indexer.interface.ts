export interface VectorIndexPoint {
  readonly id: string;
  readonly vector: readonly number[];
  readonly payload: {
    readonly companyId: string;
    readonly documentId: string;
    readonly chunkIndex: number;
    readonly content: string;
  };
}

/**
 * Write-side gateway to Qdrant — implemented by QdrantIndexerProvider.
 * The read side (search/retrieval) is the AI module's own concern via its
 * separate VectorStore interface (see ROLE.md §7 — no cross-module
 * infrastructure reuse, even against the same underlying Qdrant collection).
 */
export interface VectorIndexer {
  upsert(points: readonly VectorIndexPoint[]): Promise<void>;
  deleteByDocumentId(documentId: string): Promise<void>;
}
