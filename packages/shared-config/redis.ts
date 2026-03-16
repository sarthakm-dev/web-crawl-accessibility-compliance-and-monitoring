import Redis from 'ioredis';
import { env } from '@packages/shared-config/env';
import { logger } from '@packages/shared-config/logger';
export const redis = new Redis({
  host: env.REDIS_HOST || 'localhost',
  port: Number(env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 5) {
      logger.error('Redis retry attempts exhausted');
      return null;
    }
    return 2000;
  },
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', err => {
  logger.error({ err }, 'Redis error:');
});
