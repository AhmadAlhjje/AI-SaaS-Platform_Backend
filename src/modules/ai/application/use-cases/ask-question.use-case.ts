import { Injectable } from '@nestjs/common';
import { DataTableRowEntity } from '../../../data-tables/domain/entities/data-table-row.entity';
import { ListDataTablesUseCase } from '../../../data-tables/application/use-cases/list-data-tables.use-case';
import { GetAiConfigurationUseCase } from '../../../ai-configuration/application/use-cases/get-ai-configuration.use-case';
import { AiAnswer } from '../../domain/interfaces/ai-provider.interface';
import { VectorSearchMatch } from '../../domain/interfaces/vector-store.interface';
import { QuestionRoute } from '../../domain/value-objects/question-route.value-object';
import { GenerateAnswerUseCase } from './generate-answer.use-case';
import { RetrieveRelevantChunksUseCase } from './retrieve-relevant-chunks.use-case';
import { RouteQuestionUseCase } from './route-question.use-case';
import { RunSqlAgentQueryUseCase } from './run-sql-agent-query.use-case';

export interface AskQuestionInput {
  readonly companyId: string;
  readonly question: string;
}

const HUMAN_ESCALATION_MODEL = 'human-escalation';
const HUMAN_ESCALATION_MESSAGE =
  'عذراً، لم أتمكن من العثور على إجابة دقيقة لسؤالك ضمن البيانات المتوفرة حالياً. سيتواصل معك أحد موظفي الدعم خلال وقت قصير.';

/**
 * Orchestrator: ai-configuration (per-company settings) → retrieve RAG
 * context + list data tables in parallel → route-question decides RAG vs
 * SQL_AGENT vs HUMAN among only the sources that actually have something to
 * offer for this company → generate-answer, or a fixed human-escalation
 * reply with no LLM call at all. There is no general-purpose chat route —
 * every answer either comes from a real source or is handed to a human.
 * This is what conversations' SendMessageUseCase calls (an "include"
 * relation) to turn a user message into a reply.
 */
@Injectable()
export class AskQuestionUseCase {
  constructor(
    private readonly getAiConfigurationUseCase: GetAiConfigurationUseCase,
    private readonly retrieveRelevantChunksUseCase: RetrieveRelevantChunksUseCase,
    private readonly listDataTablesUseCase: ListDataTablesUseCase,
    private readonly routeQuestionUseCase: RouteQuestionUseCase,
    private readonly runSqlAgentQueryUseCase: RunSqlAgentQueryUseCase,
    private readonly generateAnswerUseCase: GenerateAnswerUseCase,
  ) {}

  async execute(input: AskQuestionInput): Promise<AiAnswer> {
    const config = await this.getAiConfigurationUseCase.execute({ companyId: input.companyId });

    const [retrievedChunks, dataTables] = await Promise.all([
      this.retrieveRelevantChunksUseCase.execute({
        companyId: input.companyId,
        question: input.question,
        topK: config.ragTopK,
      }),
      this.listDataTablesUseCase.execute({ companyId: input.companyId }),
    ]);

    const routeDecision = await this.routeQuestionUseCase.execute({
      question: input.question,
      hasDocuments: retrievedChunks.length > 0,
      hasDataTables: dataTables.length > 0,
      model: config.model,
    });

    if (routeDecision.route === QuestionRoute.RAG) {
      return this.generateAnswerUseCase.execute({
        question: input.question,
        context: this.buildRagContext(retrievedChunks),
        systemPrompt: config.systemPrompt,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });
    }

    if (routeDecision.route === QuestionRoute.SQL_AGENT) {
      const result = await this.runSqlAgentQueryUseCase.execute({
        companyId: input.companyId,
        question: input.question,
      });

      if (!result) {
        return this.humanEscalation();
      }

      return this.generateAnswerUseCase.execute({
        question: input.question,
        context: this.buildSqlContext(result.rows),
        systemPrompt: config.systemPrompt,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      });
    }

    return this.humanEscalation();
  }

  private buildRagContext(chunks: readonly VectorSearchMatch[]): string {
    return chunks.map((chunk, index) => `[${index + 1}] ${chunk.content}`).join('\n\n');
  }

  private buildSqlContext(rows: readonly DataTableRowEntity[]): string {
    if (rows.length === 0) {
      return 'The query returned no matching rows.';
    }

    return rows.map((row, index) => `[${index + 1}] ${JSON.stringify(row.rowData)}`).join('\n');
  }

  private humanEscalation(): AiAnswer {
    return {
      content: HUMAN_ESCALATION_MESSAGE,
      modelUsed: HUMAN_ESCALATION_MODEL,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };
  }
}
