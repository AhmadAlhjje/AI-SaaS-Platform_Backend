import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EmbeddingsProvider } from '../../domain/interfaces/embeddings-provider.interface';
import { VectorSearchMatch, VectorStore } from '../../domain/interfaces/vector-store.interface';

export interface RetrieveRelevantChunksInput {
  readonly companyId: string;
  readonly question: string;
  readonly topK: number;
}

/**
 * Embeds the question and searches this company's chunks in Qdrant.
 * Returns an empty array when nothing has been indexed yet (e.g. no PDF
 * documents uploaded/processed) — callers treat that as "no context available"
 * rather than an error, so plain-chat answers degrade gracefully.
 */
@Injectable()
export class RetrieveRelevantChunksUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.EMBEDDINGS_PROVIDER) private readonly embeddingsProvider: EmbeddingsProvider,
    @Inject(PROVIDER_TOKENS.VECTOR_STORE) private readonly vectorStore: VectorStore,
  ) {}

  async execute(input: RetrieveRelevantChunksInput): Promise<VectorSearchMatch[]> {
    const { vectors } = await this.embeddingsProvider.embed([input.question]);
    return this.vectorStore.search(input.companyId, vectors[0], input.topK);
  }
}
