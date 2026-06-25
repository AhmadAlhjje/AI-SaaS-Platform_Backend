export interface EmbeddingsResult {
  readonly vectors: readonly number[][];
  readonly model: string;
}

/**
 * Gateway to the external ai-service's embeddings endpoint — implemented by
 * HttpEmbeddingsProvider in infrastructure. Used both when indexing document
 * chunks (Documents module, via this module's exported GenerateEmbeddingsUseCase)
 * and when embedding a question for retrieval (RetrieveRelevantChunksUseCase).
 */
export interface EmbeddingsProvider {
  embed(texts: readonly string[]): Promise<EmbeddingsResult>;
}
