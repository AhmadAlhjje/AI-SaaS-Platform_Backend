import { Injectable } from '@nestjs/common';
import { QuestionRoute, RouteDecision } from '../../domain/value-objects/question-route.value-object';

export interface RouteQuestionInput {
  readonly question: string;
}

/**
 * Today this always routes to plain chat. Once Step 6/7 land, this is where
 * "does this company have indexed documents? a matching data table?" checks
 * decide between PLAIN_CHAT, RAG, and SQL_AGENT.
 */
@Injectable()
export class RouteQuestionUseCase {
  execute(_input: RouteQuestionInput): RouteDecision {
    return { route: QuestionRoute.PLAIN_CHAT };
  }
}
