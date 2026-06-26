import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { AskQuestionUseCase } from '../../application/use-cases/ask-question.use-case';
import { GenerateAnswerUseCase } from '../../application/use-cases/generate-answer.use-case';
import { AskQuestionDto } from '../dto/ask-question.dto';
import { TestPromptDto } from '../dto/test-prompt.dto';
import { AnswerResponse } from '../responses/answer.response';

@Controller('ai')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class AiController {
  constructor(
    private readonly askQuestionUseCase: AskQuestionUseCase,
    private readonly generateAnswerUseCase: GenerateAnswerUseCase,
  ) {}

  @Post('ask')
  async ask(@CurrentCompany() companyId: string, @Body() dto: AskQuestionDto): Promise<AnswerResponse> {
    const answer = await this.askQuestionUseCase.execute({ companyId, question: dto.question });
    return new AnswerResponse(answer);
  }

  // Bypasses RAG/SQL routing entirely — lets AI Settings preview not-yet-saved
  // system prompt/model/temperature changes directly against the LLM.
  @Post('test-prompt')
  async testPrompt(@Body() dto: TestPromptDto): Promise<AnswerResponse> {
    const answer = await this.generateAnswerUseCase.execute({
      question: dto.question,
      context: null,
      systemPrompt: dto.systemPrompt ?? null,
      model: dto.model,
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    });

    return new AnswerResponse(answer);
  }
}
