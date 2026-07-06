// ============================================================
// Sharing Module
// ============================================================

import type { FastifyInstance } from 'fastify';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {
  UuidParamsSchema,
  CreateShareBodySchema,
  ShareTokenParamsSchema,
  ShareAccessQuerySchema,
} from '../../schemas/validation.js';

export default async function sharingModule(fastify: FastifyInstance) {
  // ── POST /bundles/:id/share — Create share link ────────────
  fastify.post('/bundles/:id/share', {
    preHandler: [async (request, reply) => { await (fastify as any).verifyFirebaseToken(request, reply); }],
  }, async (request, reply) => {
    const { uid } = request.firebaseUser;

    const paramsParsed = UuidParamsSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid bundle ID', details: paramsParsed.error.flatten().fieldErrors });
    }
    const { id } = paramsParsed.data;

    const bodyParsed = CreateShareBodySchema.safeParse(request.body);
    if (!bodyParsed.success) {
      return reply.status(400).send({ error: 'Invalid request body', details: bodyParsed.error.flatten().fieldErrors });
    }
    const { expiresInHours, password, maxAccess } = bodyParsed.data;

    // Verify bundle ownership
    const bundle = await fastify.pg.query(
      'SELECT id FROM toffee_bundles WHERE id = $1 AND user_id = $2',
      [id, uid]
    );

    if (bundle.rows.length === 0) {
      return reply.status(404).send({ error: 'Bundle not found' });
    }

    const shareToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInHours * 3600 * 1000);
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    await fastify.pg.query(
      `INSERT INTO share_links (id, bundle_id, created_by, token, password_hash, expires_at, max_access)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [uuid(), id, uid, shareToken, passwordHash, expiresAt, maxAccess]
    );

    return {
      shareUrl: `https://toffee.ai/share/${shareToken}`,
      token: shareToken,
      expiresAt: expiresAt.toISOString(),
    };
  });

  // ── GET /share/:token — Access shared bundle ───────────────
  fastify.get('/share/:token', async (request, reply) => {
    const paramsParsed = ShareTokenParamsSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid share token', details: paramsParsed.error.flatten().fieldErrors });
    }
    const { token } = paramsParsed.data;

    const queryParsed = ShareAccessQuerySchema.safeParse(request.query);
    if (!queryParsed.success) {
      return reply.status(400).send({ error: 'Invalid query parameters', details: queryParsed.error.flatten().fieldErrors });
    }
    const { password } = queryParsed.data;

    const result = await fastify.pg.query(
      `SELECT sl.*, tb.display_name, tb.source_platform, tb.compression_profile, tb.token_count_bundle, tb.s3_key
       FROM share_links sl
       JOIN toffee_bundles tb ON sl.bundle_id = tb.id
       WHERE sl.token = $1 AND sl.expires_at > NOW() AND sl.access_count < sl.max_access`,
      [token]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ error: 'Share link not found, expired, or access limit reached' });
    }

    const share = result.rows[0];

    // Check password if required
    if (share.password_hash) {
      if (!password || !(await bcrypt.compare(password, share.password_hash))) {
        return reply.status(401).send({ error: 'Password required' });
      }
    }

    // Increment access count
    await fastify.pg.query(
      'UPDATE share_links SET access_count = access_count + 1 WHERE id = $1',
      [share.id]
    );

    return {
      bundle: {
        display_name: share.display_name,
        source_platform: share.source_platform,
        compression_profile: share.compression_profile,
        token_count_bundle: share.token_count_bundle,
      },
      expiresAt: share.expires_at,
      accessCount: share.access_count + 1,
    };
  });
}
