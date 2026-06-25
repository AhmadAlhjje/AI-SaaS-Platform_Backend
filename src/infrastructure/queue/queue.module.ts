import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from '../config/redis.config';

/**
 * Registers the shared BullMQ Redis connection once, globally — feature
 * modules only need `BullModule.registerQueue({ name: ... })`, never their
 * own connection config (ROLE.md §13: heavy operations run through queues).
 *
 * Connection is passed as a plain options object (not an `ioredis` Redis
 * instance) to avoid a type clash between our own `ioredis` dependency and
 * the one bundled inside `bullmq` — they're structurally identical but
 * TypeScript treats them as different classes.
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { hostname, port, username, password } = new URL(configService.get<RedisConfig>('redis')!.url);

        return {
          connection: {
            host: hostname,
            port: Number(port || 6379),
            username: username || undefined,
            password: password || undefined,
            // BullMQ requires this for its blocking commands.
            maxRetriesPerRequest: null,
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
