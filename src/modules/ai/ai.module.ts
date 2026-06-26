import { Module } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../shared/constants/tokens.constants';
import { AiConfigurationModule } from '../ai-configuration/ai-configuration.module';
import { DataTablesModule } from '../data-tables/data-tables.module';
import { AskQuestionUseCase } from './application/use-cases/ask-question.use-case';
import { GenerateAnswerUseCase } from './application/use-cases/generate-answer.use-case';
import { GenerateEmbeddingsUseCase } from './application/use-cases/generate-embeddings.use-case';
import { RetrieveRelevantChunksUseCase } from './application/use-cases/retrieve-relevant-chunks.use-case';
import { RouteQuestionUseCase } from './application/use-cases/route-question.use-case';
import { RunSqlAgentQueryUseCase } from './application/use-cases/run-sql-agent-query.use-case';
import { HttpAiProvider } from './infrastructure/providers/http-ai-provider.provider';
import { HttpEmbeddingsProvider } from './infrastructure/providers/http-embeddings-provider.provider';
import { HttpQuestionRouterProvider } from './infrastructure/providers/http-question-router.provider';
import { QdrantRetrieverProvider } from './infrastructure/providers/qdrant-retriever.provider';
import { AiController } from './presentation/controllers/ai.controller';

@Module({
  imports: [AiConfigurationModule, DataTablesModule],
  controllers: [AiController],
  providers: [
    AskQuestionUseCase,
    RouteQuestionUseCase,
    RetrieveRelevantChunksUseCase,
    RunSqlAgentQueryUseCase,
    GenerateAnswerUseCase,
    GenerateEmbeddingsUseCase,
    { provide: PROVIDER_TOKENS.AI_PROVIDER, useClass: HttpAiProvider },
    { provide: PROVIDER_TOKENS.EMBEDDINGS_PROVIDER, useClass: HttpEmbeddingsProvider },
    { provide: PROVIDER_TOKENS.VECTOR_STORE, useClass: QdrantRetrieverProvider },
    { provide: PROVIDER_TOKENS.QUESTION_ROUTER, useClass: HttpQuestionRouterProvider },
  ],
  // Exported so conversations' SendMessageUseCase can call AskQuestionUseCase
  // directly (the agreed "include" wiring), and so Documents' embedding
  // pipeline can call GenerateEmbeddingsUseCase — both public application
  // services per ROLE.md §7.
  exports: [AskQuestionUseCase, GenerateEmbeddingsUseCase],
})
export class AiModule {}
