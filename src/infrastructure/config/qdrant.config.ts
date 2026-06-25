import { registerAs } from '@nestjs/config';

export interface QdrantConfig {
  readonly url: string;
  readonly apiKey?: string;
  readonly collectionName: string;
  readonly vectorSize: number;
}

export default registerAs(
  'qdrant',
  (): QdrantConfig => ({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: process.env.QDRANT_COLLECTION ?? 'document_chunks',
    vectorSize: Number(process.env.QDRANT_VECTOR_SIZE ?? 384),
  }),
);
