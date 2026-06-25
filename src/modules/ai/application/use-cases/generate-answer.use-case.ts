import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../../shared/constants/tokens.constants';
import { AiAnswer, AiProvider } from '../../domain/interfaces/ai-provider.interface';
import { VectorSearchMatch } from '../../domain/interfaces/vector-store.interface';
import { RouteDecision } from '../../domain/value-objects/question-route.value-object';

export interface GenerateAnswerInput {
  readonly question: string;
  readonly routeDecision: RouteDecision;
  readonly retrievedChunks: readonly VectorSearchMatch[];
  readonly systemPrompt: string | null;
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
}

/**
 * `routeDecision` is unused while only PLAIN_CHAT exists — Step 7 (SQL
 * Agent) will branch here to inject query results into the prompt instead.
 * RAG context is already real: when `retrievedChunks` is non-empty, it's
 * woven into the system prompt before calling the provider.
 */
@Injectable()
export class GenerateAnswerUseCase {
  constructor(@Inject(PROVIDER_TOKENS.AI_PROVIDER) private readonly aiProvider: AiProvider) {}

  execute(input: GenerateAnswerInput): Promise<AiAnswer> {
    return this.aiProvider.ask(input.question, {
      systemPrompt: this.buildSystemPrompt(input.systemPrompt, input.retrievedChunks),
      model: input.model,
      temperature: input.temperature,
      maxTokens: input.maxTokens,
    });
  }

  private buildSystemPrompt(systemPrompt: string | null, retrievedChunks: readonly VectorSearchMatch[]): string | null {
    if (retrievedChunks.length === 0) {
      return systemPrompt;
    }

    const context = retrievedChunks.map((chunk, index) => `[${index + 1}] ${chunk.content}`).join('\n\n');
    const instruction = 'Answer using the context below when it is relevant. If it is not relevant, answer normally.';

    return [systemPrompt, instruction, `Context:\n${context}`].filter(Boolean).join('\n\n');
  }
}
