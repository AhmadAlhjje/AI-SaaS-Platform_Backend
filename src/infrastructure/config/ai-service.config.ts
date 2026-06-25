import { registerAs } from '@nestjs/config';

export interface AiServiceConfig {
  readonly baseUrl: string;
  readonly requestTimeoutMs: number;
}

export default registerAs(
  'aiService',
  (): AiServiceConfig => ({
    baseUrl: process.env.AI_SERVICE_URL!,
    requestTimeoutMs: Number(process.env.AI_SERVICE_TIMEOUT_MS ?? 30000),
  }),
);
