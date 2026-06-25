import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiServiceConfig } from '../../../../infrastructure/config/ai-service.config';
import { AiProviderUnavailableError } from '../../domain/errors/ai-provider-unavailable.error';
import { EmbeddingsProvider, EmbeddingsResult } from '../../domain/interfaces/embeddings-provider.interface';

interface EmbeddingsServiceResponseBody {
  readonly vectors: number[][];
  readonly model: string;
}

@Injectable()
export class HttpEmbeddingsProvider implements EmbeddingsProvider {
  constructor(private readonly configService: ConfigService) {}

  async embed(texts: readonly string[]): Promise<EmbeddingsResult> {
    const config = this.configService.get<AiServiceConfig>('aiService')!;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

    let response: Response;
    try {
      response = await fetch(`${config.baseUrl}/api/v1/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ texts }),
      });
    } catch (error) {
      throw new AiProviderUnavailableError(error instanceof Error ? error.message : 'request failed');
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new AiProviderUnavailableError(`HTTP ${response.status}`);
    }

    const body = (await response.json()) as EmbeddingsServiceResponseBody;
    return { vectors: body.vectors, model: body.model };
  }
}
