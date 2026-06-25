export interface AskOptions {
  readonly systemPrompt: string | null;
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
}

export interface AiAnswer {
  readonly content: string;
  readonly modelUsed: string;
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
}

/**
 * Gateway to the external ai-service (ROLE.md §8) — implemented by
 * HttpAiProvider in infrastructure. Never called directly from a
 * controller or another module; only through AskQuestionUseCase.
 */
export interface AiProvider {
  ask(question: string, options: AskOptions): Promise<AiAnswer>;
}
