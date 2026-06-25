import { AiAnswer } from '../../domain/interfaces/ai-provider.interface';

export class AnswerResponse {
  readonly content: string;
  readonly modelUsed: string;

  constructor(answer: AiAnswer) {
    this.content = answer.content;
    this.modelUsed = answer.modelUsed;
  }
}
