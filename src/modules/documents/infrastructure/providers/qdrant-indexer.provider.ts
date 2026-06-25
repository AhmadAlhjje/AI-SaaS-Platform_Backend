import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantConfig } from '../../../../infrastructure/config/qdrant.config';
import { VectorIndexer, VectorIndexPoint } from '../../domain/interfaces/vector-indexer.interface';

// @qdrant/js-client-rest ships ESM-only; this project builds to CommonJS, so
// the module can only be loaded via dynamic import — this type query avoids
// a static import while still getting a real (non-`any`) client type.
type QdrantClient = InstanceType<
  Awaited<typeof import('@qdrant/js-client-rest', { with: { 'resolution-mode': 'import' } })>['QdrantClient']
>;

@Injectable()
export class QdrantIndexerProvider implements VectorIndexer {
  private readonly config: QdrantConfig;
  private clientPromise: Promise<QdrantClient> | null = null;
  private collectionEnsured = false;

  constructor(configService: ConfigService) {
    this.config = configService.get<QdrantConfig>('qdrant')!;
  }

  async upsert(points: readonly VectorIndexPoint[]): Promise<void> {
    if (points.length === 0) {
      return;
    }

    const client = await this.ensureCollection();
    await client.upsert(this.config.collectionName, {
      points: points.map((point) => ({ id: point.id, vector: point.vector as number[], payload: point.payload })),
    });
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    const client = await this.ensureCollection();
    await client.delete(this.config.collectionName, {
      filter: { must: [{ key: 'documentId', match: { value: documentId } }] },
    });
  }

  private getClient(): Promise<QdrantClient> {
    if (!this.clientPromise) {
      this.clientPromise = import('@qdrant/js-client-rest').then(
        ({ QdrantClient }) => new QdrantClient({ url: this.config.url, apiKey: this.config.apiKey }),
      );
    }

    return this.clientPromise;
  }

  private async ensureCollection(): Promise<QdrantClient> {
    const client = await this.getClient();
    if (this.collectionEnsured) {
      return client;
    }

    const { exists } = await client.collectionExists(this.config.collectionName);
    if (!exists) {
      await client.createCollection(this.config.collectionName, {
        vectors: { size: this.config.vectorSize, distance: 'Cosine' },
      });
    }

    this.collectionEnsured = true;
    return client;
  }
}
