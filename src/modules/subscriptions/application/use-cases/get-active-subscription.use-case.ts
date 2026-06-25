import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { SubscriptionNotFoundError } from '../../domain/errors/subscription-not-found.error';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';

export interface GetActiveSubscriptionInput {
  readonly companyId: string;
}

@Injectable()
export class GetActiveSubscriptionUseCase {
  constructor(@Inject(REPOSITORY_TOKENS.SUBSCRIPTION_REPOSITORY) private readonly subscriptionRepository: SubscriptionRepository) {}

  async execute(input: GetActiveSubscriptionInput): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findActiveByCompanyId(input.companyId);

    if (!subscription) {
      throw new SubscriptionNotFoundError(input.companyId);
    }

    return subscription;
  }
}
