import { Module } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../shared/constants/tokens.constants';
import { ProvisionDefaultAiConfigurationHandler } from './application/event-handlers/provision-default-ai-configuration.handler';
import { GetAiConfigurationUseCase } from './application/use-cases/get-ai-configuration.use-case';
import { ResetAiConfigurationUseCase } from './application/use-cases/reset-ai-configuration.use-case';
import { UpdateAiConfigurationUseCase } from './application/use-cases/update-ai-configuration.use-case';
import { PrismaAiConfigurationRepository } from './infrastructure/repositories/prisma-ai-configuration.repository';
import { AiConfigurationController } from './presentation/controllers/ai-configuration.controller';

@Module({
  controllers: [AiConfigurationController],
  providers: [
    GetAiConfigurationUseCase,
    UpdateAiConfigurationUseCase,
    ResetAiConfigurationUseCase,
    ProvisionDefaultAiConfigurationHandler,
    { provide: REPOSITORY_TOKENS.AI_CONFIGURATION_REPOSITORY, useClass: PrismaAiConfigurationRepository },
  ],
  // Exported so the AI module can fetch a company's configuration as a
  // public application service (ROLE.md §7) instead of reaching into this
  // module's repository/infrastructure directly.
  exports: [GetAiConfigurationUseCase],
})
export class AiConfigurationModule {}
