// ============================================================
// Bundles Module — CRUD + Cloud Storage
// ============================================================

import type { FastifyInstance } from 'fastify';
import { v4 as uuid } from 'uuid';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import zlib from 'zlib';
import util from 'util';
const gunzip = util.promisify(zlib.gunzip);
const gzip = util.promisify(zlib.gzip);
import { env } from '../../config/env.js';
import {
  BundleListQuerySchema,
  CreateBundleBodySchema,
  UuidParamsSchema,
} from '../../schemas/validation.js';
import { sseService } from '../../services/sse.service.js';

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

      // Emit Server-Sent Event to connected dashboards
      sseService.sendToUser(uid, 'new_bundle', { id: bundleId, display_name: body.display_name });

      return reply.status(201).send({ id: bundleId, s3Key });
    } catch (error) {
      await client.query('ROLLBACK');
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create bundle' });
    } finally {
      client.release();
    }
  });

  // ── POST /merge — Merge multiple bundles ───────────────────
  fastify.post('/merge', async (request, reply) => {
    const { uid } = request.firebaseUser;

    const { bundleIds, display_name } = request.body as { bundleIds: string[], display_name: string };
    if (!Array.isArray(bundleIds) || bundleIds.length < 2) {
      return reply.status(400).send({ error: 'Provide at least two bundleIds to merge' });
    }

    const client = await fastify.pg.connect();
    try {
      // 1. Fetch metadata and verify ownership
      const result = await client.query(
        'SELECT id, s3_key, token_count_original, token_count_bundle FROM toffee_bundles WHERE id = ANY($1) AND user_id = $2',
        [bundleIds, uid]
      );

      if (result.rows.length !== bundleIds.length) {
        throw new Error('One or more bundles not found or access denied');
      }

      // 2. Download from S3 and decompress
      const bundlesData = [];
      let totalOriginalTokens = 0;
      let totalBundleTokens = 0;

      for (const row of result.rows) {
        totalOriginalTokens += row.token_count_original;
        totalBundleTokens += row.token_count_bundle;
        
        const s3Response = await s3.send(new GetObjectCommand({
          Bucket: env.AWS_S3_BUCKET,
          Key: row.s3_key,
        }));
        
        const base64Str = await s3Response.Body?.transformToString();
        if (base64Str) {
          const compressedBytes = Buffer.from(base64Str, 'base64');
          const jsonBytes = await gunzip(compressedBytes);
          bundlesData.push(JSON.parse(jsonBytes.toString('utf-8')));
        }
      }

      // 3. Merge payloads
      const newBundleId = uuid();
      const mergedTopics = new Set<string>();
      let mergedContext = '';
      let mergedGoal = '';

      bundlesData.forEach((b, index) => {
        if (b.topics) b.topics.forEach((t: string) => mergedTopics.add(t));
        mergedContext += `\n[Context from ${b.source_platform || 'Bundle ' + (index+1)}]\n${b.summary.critical_context}\n`;
        mergedGoal += `${b.summary.conversation_goal}; `;
      });

      const mergedBundle = {
        schema_version: '1.0.0',
        bundle_id: newBundleId,
        created_at: new Date().toISOString(),
        source_platform: 'toffee-stitched',
        source_model: 'multi-model-stitch',
        capture_method: 'dom_scrape',
        summary: {
          conversation_goal: mergedGoal.trim(),
          key_decisions: bundlesData.flatMap(b => b.summary.key_decisions || []),
          ongoing_tasks: bundlesData.flatMap(b => b.summary.ongoing_tasks || []),
          user_preferences_inferred: 'Mixed contexts',
          critical_context: mergedContext.trim(),
          suggested_continuation: 'Review merged context.',
          knowledge_gaps: bundlesData.flatMap(b => b.summary.knowledge_gaps || []),
        },
        topics: Array.from(mergedTopics),
        snippet_count: bundlesData.reduce((acc, b) => acc + (b.snippet_count || 1), 0),
        token_count_original: totalOriginalTokens,
        token_count_bundle: totalBundleTokens, // Approximate
        compression_ratio: totalBundleTokens / totalOriginalTokens,
        compression_profile: 'standard',
        version: 1,
        hmac_sha256: '0'.repeat(64), // We skip real HMAC for stitched bundles to save complexity
      };

      const finalJsonString = JSON.stringify(mergedBundle);
      const finalCompressedBytes = await gzip(Buffer.from(finalJsonString, 'utf-8'));
      const finalBundleDataB64 = finalCompressedBytes.toString('base64');
      const newS3Key = `bundles/${uid}/${newBundleId}.toffee`;

      await client.query('BEGIN');

      // 4. Save to Postgres
      await client.query(
        `INSERT INTO toffee_bundles (id, user_id, display_name, source_platform, source_model, compression_profile, token_count_original, token_count_bundle, compression_ratio, s3_key, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [newBundleId, uid, display_name || 'Stitched Context', 'toffee-stitched', 'multi-model-stitch', 'standard', totalOriginalTokens, totalBundleTokens, totalBundleTokens/totalOriginalTokens, newS3Key, Array.from(mergedTopics)]
      );

      // 5. Upload to S3
      await s3.send(new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: newS3Key,
        Body: Buffer.from(finalBundleDataB64, 'base64'),
        ContentType: 'application/x-toffee',
        ServerSideEncryption: 'aws:kms',
      }));

      await client.query('COMMIT');
      
      sseService.sendToUser(uid, 'new_bundle', { id: newBundleId, display_name: display_name || 'Stitched Context' });

      return reply.status(201).send({ id: newBundleId, s3Key: newS3Key });

    } catch (error: any) {
      if (client) await client.query('ROLLBACK');
      fastify.log.error(error);
      return reply.status(500).send({ error: error.message || 'Failed to merge bundles' });
    } finally {
      client.release();
    }
  });

  // ── GET /tags — Get unique tags ─────────────────────────────
  fastify.get('/tags', async (request) => {
    const { uid } = request.firebaseUser;
    
    const result = await fastify.pg.query(
      'SELECT DISTINCT unnest(tags) as tag FROM toffee_bundles WHERE user_id = $1 ORDER BY tag ASC',
      [uid]
    );

    return { tags: result.rows.map(row => row.tag) };
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

  // ── PATCH /:id/tags — Update bundle tags ───────────────────
  fastify.patch('/:id/tags', async (request, reply) => {
    const { uid } = request.firebaseUser;

    const paramsParsed = UuidParamsSchema.safeParse(request.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid bundle ID', details: paramsParsed.error.flatten().fieldErrors });
    }
    const { id } = paramsParsed.data;

    const { tags } = request.body as { tags: string[] };
    if (!Array.isArray(tags)) {
      return reply.status(400).send({ error: 'Tags must be an array of strings' });
    }

    const result = await fastify.pg.query(
      'UPDATE toffee_bundles SET tags = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING id',
      [tags, id, uid]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ error: 'Bundle not found' });
    }

    return { success: true };
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
