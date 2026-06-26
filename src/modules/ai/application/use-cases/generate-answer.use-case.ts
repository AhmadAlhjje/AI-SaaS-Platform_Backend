import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../../shared/constants/tokens.constants';
import { AiAnswer, AiProvider } from '../../domain/interfaces/ai-provider.interface';

export interface GenerateAnswerInput {
  readonly question: string;
  readonly context: string | null;
  readonly systemPrompt: string | null;
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
}

/**
 * `context` is pre-formatted by the caller (AskQuestionUseCase) — either RAG
 * chunks or SQL Agent rows, formatted differently but woven into the system
 * prompt the same way. Never called when there's no context to answer from;
 * that case is a HUMAN route, handled entirely in AskQuestionUseCase without
 * reaching this far.
 */
@Injectable()
export class GenerateAnswerUseCase {
  constructor(@Inject(PROVIDER_TOKENS.AI_PROVIDER) private readonly aiProvider: AiProvider) {}

  execute(input: GenerateAnswerInput): Promise<AiAnswer> {
    return this.aiProvider.ask(input.question, {
      systemPrompt: this.buildSystemPrompt(input.systemPrompt, input.context),
      model: input.model,
      temperature: input.temperature,
      maxTokens: input.maxTokens,
    });
  }

  private buildSystemPrompt(systemPrompt: string | null, context: string | null): string | null {
    if (!context) {
      return systemPrompt;
    }

    const instruction =
      'Answer using the context below. If the answer truly cannot be derived from it, say so honestly instead of guessing.';

    return [systemPrompt, instruction, `Context:\n${context}`].filter(Boolean).join('\n\n');
  }
}
