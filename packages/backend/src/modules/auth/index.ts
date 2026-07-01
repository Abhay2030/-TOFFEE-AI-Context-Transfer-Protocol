// ============================================================
// Auth Module — Fastify Plugin (Firebase Auth)
// ============================================================

import type { FastifyInstance } from 'fastify';

export default async function authModule(fastify: FastifyInstance) {
  // ── GET /me — Get current user profile ─────────────────────
  fastify.get('/me', {
    preHandler: [async (request, reply) => {
      await (fastify as any).verifyFirebaseToken(request, reply);
    }],
  }, async (request) => {
    const { uid, email } = request.firebaseUser;

    // Check if user exists in our database
    let result = await fastify.pg.query(
      'SELECT id, email, plan_tier, mfa_enabled, preferences, created_at FROM users WHERE id = $1',
      [uid]
    );

    // Auto-sync: if user doesn't exist in our DB yet, create them
    if (result.rows.length === 0) {
      await fastify.pg.query(
        `INSERT INTO users (id, email, auth_provider, plan_tier)
         VALUES ($1, $2, 'firebase', 'free')
         ON CONFLICT (id) DO NOTHING`,
        [uid, email]
      );

      result = await fastify.pg.query(
        'SELECT id, email, plan_tier, mfa_enabled, preferences, created_at FROM users WHERE id = $1',
        [uid]
      );

      fastify.log.info(`New Firebase user synced: ${uid} (${email})`);
    }

    return { user: result.rows[0] };
  });

  // ── POST /sync — Explicit user sync endpoint ──────────────
  fastify.post('/sync', {
    preHandler: [async (request, reply) => {
      await (fastify as any).verifyFirebaseToken(request, reply);
    }],
  }, async (request) => {
    const { uid, email } = request.firebaseUser;

    await fastify.pg.query(
      `INSERT INTO users (id, email, auth_provider, plan_tier)
       VALUES ($1, $2, 'firebase', 'free')
       ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW()`,
      [uid, email]
    );

    fastify.log.info(`User synced: ${uid} (${email})`);

    return { synced: true, uid };
  });
}
