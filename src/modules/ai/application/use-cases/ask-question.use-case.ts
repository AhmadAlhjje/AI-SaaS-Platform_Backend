import { Injectable } from '@nestjs/common';
import { GetAiConfigurationUseCase } from '../../../ai-configuration/application/use-cases/get-ai-configuration.use-case';
import { AiAnswer } from '../../domain/interfaces/ai-provider.interface';
import { GenerateAnswerUseCase } from './generate-answer.use-case';
import { RetrieveRelevantChunksUseCase } from './retrieve-relevant-chunks.use-case';
import { RouteQuestionUseCase } from './route-question.use-case';

export interface AskQuestionInput {
  readonly companyId: string;
  readonly question: string;
}

/**
 * Orchestrator: ai-configuration (per-company settings, a public
 * application service from another module per ROLE.md §7) → route-question
 * → retrieve-relevant-chunks (real RAG: Qdrant search scoped to this
 * company, empty when nothing indexed yet) → generate-answer. This is what
 * conversations' SendMessageUseCase calls (an "include" relation) to turn a
 * user message into an AI reply.
 */
@Injectable()
export class AskQuestionUseCase {
  constructor(
    private readonly getAiConfigurationUseCase: GetAiConfigurationUseCase,
    private readonly routeQuestionUseCase: RouteQuestionUseCase,
    private readonly retrieveRelevantChunksUseCase: RetrieveRelevantChunksUseCase,
    private readonly generateAnswerUseCase: GenerateAnswerUseCase,
  ) {}

  async execute(input: AskQuestionInput): Promise<AiAnswer> {
    const config = await this.getAiConfigurationUseCase.execute({ companyId: input.companyId });
    const routeDecision = this.routeQuestionUseCase.execute({ question: input.question });
    const retrievedChunks = await this.retrieveRelevantChunksUseCase.execute({
      companyId: input.companyId,
      question: input.question,
      topK: config.ragTopK,
    });

    return this.generateAnswerUseCase.execute({
      question: input.question,
      routeDecision,
      retrievedChunks,
      systemPrompt: config.systemPrompt,
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    });
  }
}
