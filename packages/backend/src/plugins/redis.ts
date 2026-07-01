import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import Redis from 'ioredis';
import { env } from '../config/env.js';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

async function redisPlugin(fastify: FastifyInstance) {
  if (!env.REDIS_URL) {
    fastify.log.warn('⚠️ No REDIS_URL provided. Using mock Redis (in-memory, no persistence) to prevent crashes.');
    // Simple mock for fastify.redis
    const mockRedis = {
      get: async () => null,
      set: async () => 'OK',
      del: async () => 1,
      quit: async () => 'OK',
      on: () => {},
    } as unknown as Redis;
    fastify.decorate('redis', mockRedis);
    return;
  }

  const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 200, 2000),
  });

  redis.on('connect', () => fastify.log.info('✅ Redis connected'));
  redis.on('error', (err) => fastify.log.error(err, '❌ Redis error:'));

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async () => {
    await redis.quit();
    fastify.log.info('Redis connection closed');
  });
}

export default fp(redisPlugin, { name: 'redis' });
