import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../../shared/constants/tokens.constants';
import { AiAnswer, AiProvider } from '../../domain/interfaces/ai-provider.interface';
import { RouteDecision } from '../../domain/value-objects/question-route.value-object';

export interface GenerateAnswerInput {
  readonly question: string;
  readonly routeDecision: RouteDecision;
  readonly systemPrompt: string | null;
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
}

/**
 * `routeDecision` is unused while only PLAIN_CHAT exists — Step 6/7 will
 * branch here to inject retrieved chunks or SQL results into the prompt
 * before calling the provider.
 */
@Injectable()
export class GenerateAnswerUseCase {
  constructor(@Inject(PROVIDER_TOKENS.AI_PROVIDER) private readonly aiProvider: AiProvider) {}

  execute(input: GenerateAnswerInput): Promise<AiAnswer> {
    return this.aiProvider.ask(input.question, {
      systemPrompt: input.systemPrompt,
      model: input.model,
      temperature: input.temperature,
      maxTokens: input.maxTokens,
    });
  }
}
