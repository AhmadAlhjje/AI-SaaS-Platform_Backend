import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiServiceConfig } from '../../../../infrastructure/config/ai-service.config';
import { AiProviderUnavailableError } from '../../domain/errors/ai-provider-unavailable.error';
import { QuestionRouter, RouteQuestionOptions } from '../../domain/interfaces/question-router.interface';
import { QuestionRoute } from '../../domain/value-objects/question-route.value-object';

interface RouteServiceResponseBody {
  readonly route: string;
}

@Injectable()
export class HttpQuestionRouterProvider implements QuestionRouter {
  constructor(private readonly configService: ConfigService) {}

  async route(question: string, options: RouteQuestionOptions): Promise<QuestionRoute> {
    const config = this.configService.get<AiServiceConfig>('aiService')!;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

    let response: Response;
    try {
      response = await fetch(`${config.baseUrl}/api/v1/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          question,
          model: options.model,
          hasDocuments: options.hasDocuments,
          hasDataTables: options.hasDataTables,
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

    const body = (await response.json()) as RouteServiceResponseBody;
    return this.toQuestionRoute(body.route);
  }

  private toQuestionRoute(raw: string): QuestionRoute {
    const upper = raw?.toUpperCase();
    if (upper === QuestionRoute.RAG || upper === QuestionRoute.SQL_AGENT || upper === QuestionRoute.HUMAN) {
      return upper;
    }

    // Never let an unrecognized value from the service propagate — fail safe.
    return QuestionRoute.HUMAN;
  }
}
