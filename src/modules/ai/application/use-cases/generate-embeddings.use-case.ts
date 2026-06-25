import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../../shared/constants/tokens.constants';
import { EmbeddingsProvider, EmbeddingsResult } from '../../domain/interfaces/embeddings-provider.interface';

export interface GenerateEmbeddingsInput {
  readonly texts: readonly string[];
}

@Injectable()
export class GenerateEmbeddingsUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.EMBEDDINGS_PROVIDER) private readonly embeddingsProvider: EmbeddingsProvider,
  ) {}

  execute(input: GenerateEmbeddingsInput): Promise<EmbeddingsResult> {
    return this.embeddingsProvider.embed(input.texts);
  }
}
