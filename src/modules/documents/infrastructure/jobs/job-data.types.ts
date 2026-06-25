export interface ParsePdfJobData {
  readonly documentId: string;
  readonly companyId: string;
  readonly fileKey: string;
}

export interface ChunkDraft {
  readonly chunkIndex: number;
  readonly content: string;
  readonly chunkHash: string;
  readonly qdrantPointId: string;
}

export interface GenerateChunksJobData {
  readonly documentId: string;
  readonly companyId: string;
  readonly text: string;
}

export interface GenerateEmbeddingsJobData {
  readonly documentId: string;
  readonly companyId: string;
  readonly chunks: readonly ChunkDraft[];
}

export interface EmbeddedChunkDraft extends ChunkDraft {
  readonly vector: readonly number[];
  readonly embeddingModel: string;
}

export interface IndexToQdrantJobData {
  readonly documentId: string;
  readonly companyId: string;
  readonly chunks: readonly EmbeddedChunkDraft[];
}
