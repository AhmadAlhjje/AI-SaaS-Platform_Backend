import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantConfig } from '../../../../infrastructure/config/qdrant.config';
import { VectorSearchMatch, VectorStore } from '../../domain/interfaces/vector-store.interface';

// @qdrant/js-client-rest ships ESM-only; this project builds to CommonJS, so
// the module can only be loaded via dynamic import — this type query avoids
// a static import while still getting a real (non-`any`) client type.
type QdrantClient = InstanceType<
  Awaited<typeof import('@qdrant/js-client-rest', { with: { 'resolution-mode': 'import' } })>['QdrantClient']
>;

@Injectable()
export class QdrantRetrieverProvider implements VectorStore {
  private readonly config: QdrantConfig;
  private clientPromise: Promise<QdrantClient> | null = null;

  constructor(configService: ConfigService) {
    this.config = configService.get<QdrantConfig>('qdrant')!;
  }

  async search(companyId: string, vector: readonly number[], topK: number): Promise<VectorSearchMatch[]> {
    const client = await this.getClient();

    try {
      const result = await client.search(this.config.collectionName, {
        vector: vector as number[],
        limit: topK,
        filter: { must: [{ key: 'companyId', match: { value: companyId } }] },
        with_payload: true,
      });

      return result.map((point) => ({
        score: point.score,
        documentId: point.payload!.documentId as string,
        chunkIndex: point.payload!.chunkIndex as number,
        content: point.payload!.content as string,
      }));
    } catch (error) {
      // Collection doesn't exist yet (nothing indexed for any company) —
      // no context available is not an error condition for the caller.
      if (this.isCollectionNotFound(error)) {
        return [];
      }

      throw error;
    }
  }

  private getClient(): Promise<QdrantClient> {
    if (!this.clientPromise) {
      this.clientPromise = import('@qdrant/js-client-rest').then(
        ({ QdrantClient }) => new QdrantClient({ url: this.config.url, apiKey: this.config.apiKey }),
      );
    }

    return this.clientPromise;
  }

  private isCollectionNotFound(error: unknown): boolean {
    return error instanceof Error && /not found|doesn't exist/i.test(error.message);
  }
}
