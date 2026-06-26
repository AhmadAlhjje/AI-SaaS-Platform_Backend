/**
 * There is no general-purpose chat route — every question must be answered
 * from a real source (RAG over indexed documents, SQL_AGENT over a data
 * table) or escalated to a human. RouteQuestionUseCase only ever returns RAG
 * or SQL_AGENT when that source actually has something indexed for this
 * company; HUMAN is the safe default otherwise.
 */
export enum QuestionRoute {
  RAG = 'RAG',
  SQL_AGENT = 'SQL_AGENT',
  HUMAN = 'HUMAN',
}

export interface RouteDecision {
  readonly route: QuestionRoute;
}
