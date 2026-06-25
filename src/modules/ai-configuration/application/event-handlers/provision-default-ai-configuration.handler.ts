import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CompanyCreatedEvent, COMPANY_CREATED_EVENT } from '../../../companies/domain/events/company-created.event';
import { REPOSITORY_TOKENS } from '../../../../shared/constants/tokens.constants';
import { AiConfigurationEntity } from '../../domain/entities/ai-configuration.entity';
import { AiConfigurationRepository } from '../../domain/repositories/ai-configuration.repository';

/**
 * Reacts to Companies' CompanyCreatedEvent (ROLE.md §14: react to domain
 * events instead of cross-module direct calls) to provision a default,
 * editable AI configuration row the moment a company is created.
 */
@Injectable()
export class ProvisionDefaultAiConfigurationHandler {
  constructor(
    @Inject(REPOSITORY_TOKENS.AI_CONFIGURATION_REPOSITORY)
    private readonly aiConfigurationRepository: AiConfigurationRepository,
  ) {}

  @OnEvent(COMPANY_CREATED_EVENT)
  async handle(event: CompanyCreatedEvent): Promise<void> {
    const existing = await this.aiConfigurationRepository.findByCompanyId(event.companyId);
    if (existing) {
      return;
    }

    await this.aiConfigurationRepository.create(AiConfigurationEntity.createDefault(event.companyId));
  }
}
