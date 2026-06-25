/**
 * Only PLAIN_CHAT exists today. RAG (Step 6, once documents are indexed in
 * Qdrant) and SQL_AGENT (Step 7, once data tables exist) will be added as
 * routing targets without changing this contract.
 */
export enum QuestionRoute {
  PLAIN_CHAT = 'plain_chat',
}

export interface RouteDecision {
  readonly route: QuestionRoute;
}
