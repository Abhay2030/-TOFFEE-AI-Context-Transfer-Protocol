// ============================================================
// Bundles Module — CRUD + Cloud Storage
// ============================================================

import type { FastifyInstance } from 'fastify';
import { v4 as uuid } from 'uuid';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../config/env.js';
import {
  BundleListQuerySchema,
  CreateBundleBodySchema,
  UuidParamsSchema,
} from '../../schemas/validation.js';

const s3 = new S3Client({ region: env.AWS_REGION });

export default async function bundlesModule(fastify: FastifyInstance) {
  // Auth preHandler for all routes in this module (Firebase)
  fastify.addHook('preHandler', async (request, reply) => {
    await (fastify as any).verifyFirebaseToken(request, reply);
  });

  // ── GET / — List bundles ───────────────────────────────────
  fastify.get('/', async (request, reply) => {
    const { uid } = request.firebaseUser;

    const queryParsed = BundleListQuerySchema.safeParse(request.query);
    if (!queryParsed.success) {
      return reply.status(400).send({ error: 'Invalid query parameters', details: queryParsed.error.flatten().fieldErrors });
    }
    const { page, pageSize, tag, search } = queryParsed.data;

    let query = 'SELECT id, display_name, source_platform, source_model, compression_profile, token_count_original, token_count_bundle, tags, created_at, updated_at FROM toffee_bundles WHERE user_id = $1';
    const params: unknown[] = [uid];
    let paramIdx = 2;

    if (tag) {
      query += ` AND $${paramIdx} = ANY(tags)`;
      params.push(tag);
      paramIdx++;
    }

    if (search) {
      query += ` AND (display_name ILIKE $${paramIdx} OR $${paramIdx} = ANY(tags))`;
      params.push(`%${search}%`);
      paramIdx++;
    }

    query += ' ORDER BY created_at DESC LIMIT $' + paramIdx + ' OFFSET $' + (paramIdx + 1);
    params.push(pageSize, (page - 1) * pageSize);

    const result = await fastify.pg.query(query, params);

    // Get total count
    const countResult = await fastify.pg.query(
      'SELECT COUNT(*) FROM toffee_bundles WHERE user_id = $1',
      [uid]
    );

    return {
      bundles: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      pageSize,
    };
  });

  // ── POST / — Create bundle ─────────────────────────────────
  fastify.post('/', async (request, reply) => {
    const { uid } = request.firebaseUser;

    const bodyParsed = CreateBundleBodySchema.safeParse(request.body);
    if (!bodyParsed.success) {
      return reply.status(400).send({ error: 'Invalid request body', details: bodyParsed.error.flatten().fieldErrors });
    }
    const body = bodyParsed.data;

    const bundleId = uuid();
    const s3Key = `bundles/${uid}/${bundleId}.toffee`;

    const client = await fastify.pg.connect();
    try {
      await client.query('BEGIN');

      // Store metadata in PostgreSQL
      await client.query(
        `INSERT INTO toffee_bundles (id, user_id, display_name, source_platform, source_model, compression_profile, token_count_original, token_count_bundle, compression_ratio, s3_key, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [bundleId, uid, body.display_name, body.source_platform, body.source_model, body.compression_profile, body.token_count_original, body.token_count_bundle, body.compression_ratio, s3Key, body.tags]
      );

      // Upload to S3
      await s3.send(new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: Buffer.from(body.bundle_data, 'base64'),
        ContentType: 'application/x-toffee',
        ServerSideEncryption: 'aws:kms',
      }));

      await client.query('COMMIT');
      fastify.log.info(`Bundle created: ${bundleId} for user ${uid}`);
      return reply.status(201).send({ id: bundleId, s3Key });
    } catch (error) {
      await client.query('ROLLBACK');
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create bundle' });
    } finally {
      client.release();
    }
  });

  // ── GET /:id — Get bundle ──────────────────────────────────
  fastify.get('/:id', async (request, reply) => {
    const { uid } = request.firebaseUser;

    const paramsParsed = UuidParamsSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid bundle ID', details: paramsParsed.error.flatten().fieldErrors });
    }
    const { id } = paramsParsed.data;

    const result = await fastify.pg.query(
      'SELECT * FROM toffee_bundles WHERE id = $1 AND user_id = $2',
      [id, uid]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ error: 'Bundle not found' });
    }

    const bundle = result.rows[0];

    // Generate pre-signed URL for download
    const downloadUrl = await getSignedUrl(s3,
      new GetObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: bundle.s3_key }),
      { expiresIn: 3600 }
    );

    return { ...bundle, downloadUrl };
  });

  // ── DELETE /:id — Delete bundle ────────────────────────────
  fastify.delete('/:id', async (request, reply) => {
    const { uid } = request.firebaseUser;

    const paramsParsed = UuidParamsSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid bundle ID', details: paramsParsed.error.flatten().fieldErrors });
    }
    const { id } = paramsParsed.data;

    const result = await fastify.pg.query(
      'SELECT s3_key FROM toffee_bundles WHERE id = $1 AND user_id = $2',
      [id, uid]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ error: 'Bundle not found' });
    }

    // Delete from S3
    await s3.send(new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: result.rows[0].s3_key,
    }));

    // Delete from PostgreSQL
    await fastify.pg.query('DELETE FROM toffee_bundles WHERE id = $1', [id]);

    fastify.log.info(`Bundle deleted: ${id}`);

    return reply.status(204).send();
  });
}
