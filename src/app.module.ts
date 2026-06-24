import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppConfigModule } from './infrastructure/config/config.module';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { LoggerModule } from './shared/logger/logger.module';

@Module({
  imports: [AppConfigModule, EventEmitterModule.forRoot(), PrismaModule, LoggerModule],
})
export class AppModule {}
