import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../../shared/constants/tokens.constants';
import { QuestionRouter } from '../../domain/interfaces/question-router.interface';
import { QuestionRoute, RouteDecision } from '../../domain/value-objects/question-route.value-object';

export interface RouteQuestionInput {
  readonly question: string;
  readonly hasDocuments: boolean;
  readonly hasDataTables: boolean;
  readonly model: string;
}

/**
 * Decides RAG vs SQL_AGENT vs HUMAN. Two layers of defense before a route
 * ever reaches the caller:
 *  1. If neither source has anything indexed for this company, skip the
 *     ai-service call entirely — HUMAN is the only sane answer.
 *  2. Whatever ai-service returns is re-checked against `hasDocuments` /
 *     `hasDataTables` — a route to an empty source is downgraded to HUMAN
 *     rather than trusted, the same "never trust the LLM blindly" pattern
 *     ai-service's own sql_agent module uses.
 */
@Injectable()
export class RouteQuestionUseCase {
  constructor(@Inject(PROVIDER_TOKENS.QUESTION_ROUTER) private readonly questionRouter: QuestionRouter) {}

  async execute(input: RouteQuestionInput): Promise<RouteDecision> {
    if (!input.hasDocuments && !input.hasDataTables) {
      return { route: QuestionRoute.HUMAN };
    }

    const route = await this.questionRouter.route(input.question, {
      hasDocuments: input.hasDocuments,
      hasDataTables: input.hasDataTables,
      model: input.model,
    });

    if (route === QuestionRoute.RAG && !input.hasDocuments) {
      return { route: QuestionRoute.HUMAN };
    }
    if (route === QuestionRoute.SQL_AGENT && !input.hasDataTables) {
      return { route: QuestionRoute.HUMAN };
    }

    return { route };
  }
}
