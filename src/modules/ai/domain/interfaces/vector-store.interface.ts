export interface VectorSearchMatch {
  readonly score: number;
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly content: string;
}

/**
 * Read-side gateway to Qdrant — implemented by QdrantRetrieverProvider.
 * The write side (indexing chunks) is the Documents module's own concern
 * via its separate VectorIndexer interface; both happen to point at the
 * same Qdrant collection, but per ROLE.md §7 neither module reaches into
 * the other's infrastructure to do it.
 */
export interface VectorStore {
  search(companyId: string, vector: readonly number[], topK: number): Promise<VectorSearchMatch[]>;
}
