import { QuestionRoute } from '../value-objects/question-route.value-object';

export interface RouteQuestionOptions {
  readonly hasDocuments: boolean;
  readonly hasDataTables: boolean;
  readonly model: string;
}

/**
 * Gateway to the external ai-service's routing endpoint (ROLE.md §8) —
 * implemented by HttpQuestionRouterProvider in infrastructure. Only ever
 * called by RouteQuestionUseCase, which re-validates the returned route
 * against `options` itself rather than trusting it blindly.
 */
export interface QuestionRouter {
  route(question: string, options: RouteQuestionOptions): Promise<QuestionRoute>;
}
