import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import aiServiceConfig from './ai-service.config';
import appConfig from './app.config';
import qdrantConfig from './qdrant.config';
import redisConfig from './redis.config';
import storageConfig from './storage.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, storageConfig, aiServiceConfig, redisConfig, qdrantConfig],
    }),
  ],
})
export class AppConfigModule {}
