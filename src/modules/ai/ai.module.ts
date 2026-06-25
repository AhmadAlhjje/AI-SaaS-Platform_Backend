import { Module } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../shared/constants/tokens.constants';
import { AiConfigurationModule } from '../ai-configuration/ai-configuration.module';
import { AskQuestionUseCase } from './application/use-cases/ask-question.use-case';
import { GenerateAnswerUseCase } from './application/use-cases/generate-answer.use-case';
import { RouteQuestionUseCase } from './application/use-cases/route-question.use-case';
import { HttpAiProvider } from './infrastructure/providers/http-ai-provider.provider';
import { AiController } from './presentation/controllers/ai.controller';

@Module({
  imports: [AiConfigurationModule],
  controllers: [AiController],
  providers: [
    AskQuestionUseCase,
    RouteQuestionUseCase,
    GenerateAnswerUseCase,
    { provide: PROVIDER_TOKENS.AI_PROVIDER, useClass: HttpAiProvider },
  ],
  // Exported so conversations' SendMessageUseCase can call it directly
  // (ROLE.md §7 public application service), per the agreed "include" wiring.
  exports: [AskQuestionUseCase],
})
export class AiModule {}
