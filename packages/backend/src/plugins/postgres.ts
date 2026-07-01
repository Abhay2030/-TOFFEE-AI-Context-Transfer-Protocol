import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import pg from 'pg';
import { env } from '../config/env.js';

declare module 'fastify' {
  interface FastifyInstance {
    pg: pg.Pool;
  }
}

async function postgresPlugin(fastify: FastifyInstance) {
  const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  // Test connection
  try {
    const client = await pool.connect();
    fastify.log.info('✅ PostgreSQL connected');
    client.release();
  } catch (err) {
    fastify.log.error(err, '❌ PostgreSQL connection failed:');
    throw err;
  }

  fastify.decorate('pg', pool);

  fastify.addHook('onClose', async () => {
    await pool.end();
    fastify.log.info('PostgreSQL pool closed');
  });
}

export default fp(postgresPlugin, { name: 'postgres' });
