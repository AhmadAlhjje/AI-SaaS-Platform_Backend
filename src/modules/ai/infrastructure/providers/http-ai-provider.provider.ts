import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiServiceConfig } from '../../../../infrastructure/config/ai-service.config';
import { AiProviderUnavailableError } from '../../domain/errors/ai-provider-unavailable.error';
import { AiAnswer, AiProvider, AskOptions } from '../../domain/interfaces/ai-provider.interface';

interface AskServiceResponseBody {
  readonly content: string;
  readonly modelUsed: string;
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
}

@Injectable()
export class HttpAiProvider implements AiProvider {
  constructor(private readonly configService: ConfigService) {}

  async ask(question: string, options: AskOptions): Promise<AiAnswer> {
    const config = this.configService.get<AiServiceConfig>('aiService')!;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

    let response: Response;
    try {
      response = await fetch(`${config.baseUrl}/api/v1/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          question,
          systemPrompt: options.systemPrompt,
          model: options.model,
          temperature: options.temperature,
          maxTokens: options.maxTokens,
        }),
      });
    } catch (error) {
      throw new AiProviderUnavailableError(error instanceof Error ? error.message : 'request failed');
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new AiProviderUnavailableError(`HTTP ${response.status}`);
    }

    const body = (await response.json()) as AskServiceResponseBody;
    return {
      content: body.content,
      modelUsed: body.modelUsed,
      promptTokens: body.promptTokens,
      completionTokens: body.completionTokens,
      totalTokens: body.totalTokens,
    };
  }
}
