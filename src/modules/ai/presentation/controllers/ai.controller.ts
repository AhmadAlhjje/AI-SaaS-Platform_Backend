import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentCompany } from '../../../../shared/decorators/current-company.decorator';
import { CompanyOwnershipGuard } from '../../../../shared/guards/company-ownership.guard';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { AskQuestionUseCase } from '../../application/use-cases/ask-question.use-case';
import { AskQuestionDto } from '../dto/ask-question.dto';
import { AnswerResponse } from '../responses/answer.response';

@Controller('ai')
@UseGuards(JwtAuthGuard, CompanyOwnershipGuard)
export class AiController {
  constructor(private readonly askQuestionUseCase: AskQuestionUseCase) {}

  @Post('ask')
  async ask(@CurrentCompany() companyId: string, @Body() dto: AskQuestionDto): Promise<AnswerResponse> {
    const answer = await this.askQuestionUseCase.execute({ companyId, question: dto.question });
    return new AnswerResponse(answer);
  }
}
