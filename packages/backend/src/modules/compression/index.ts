// ============================================================
// AI Compression Module — 8-Stage Pipeline
// ============================================================

import type { FastifyInstance } from 'fastify';
import type { RawConversation, CompressionProfile } from '@toffee/shared';
import { COMPRESSION_PROFILES } from '@toffee/shared';
import { v4 as uuid } from 'uuid';
import { compressConversationLLM } from '../../services/anthropic.service.js';

export default async function compressionModule(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request, reply) => {
    await (fastify as any).verifyFirebaseToken(request, reply);
  });

  // ── POST /compress ─────────────────────────────────────────
  fastify.post('/compress', async (request, reply) => {
    // const { uid } = request.firebaseUser;
    const { conversation, profile = 'standard' } = request.body as {
      conversation: RawConversation;
      profile?: CompressionProfile;
    };

    const startTime = Date.now();
    const profileConfig = COMPRESSION_PROFILES[profile];

    fastify.log.info(`Starting compression: profile=${profile}, turns=${conversation.turns.length}`);

    // ── Preprocessing & Real LLM Call ─────────────────────────────
    const transcriptText = conversation.turns
      .map((t: any) => `${t.role.toUpperCase()}: ${t.content}`)
      .join('\n\n');

    let summaryData;
    try {
      summaryData = await compressConversationLLM(transcriptText);
    } catch (err: any) {
      fastify.log.error(`LLM Compression failed: ${err.message}`);
      return reply.status(500).send({ error: 'Failed to compress conversation via AI Provider', details: err.message });
    }

    const summary = {
      conversation_goal: summaryData.intent.primaryGoal,
      key_decisions: summaryData.decisions,
      ongoing_tasks: summaryData.tasks,
      user_preferences_inferred: summaryData.preferences.summary,
      critical_context: summaryData.intent.criticalContext,
      suggested_continuation: summaryData.intent.suggestedContinuation,
      knowledge_gaps: summaryData.intent.knowledgeGaps,
    };

    const bundleId = uuid();
    const originalTokens = estimateTokens(transcriptText);
    const bundleTokens = estimateTokens(JSON.stringify(summary));

    const bundle = {
      schema_version: '1.0.0',
      bundle_id: bundleId,
      created_at: new Date().toISOString(),
      source_platform: conversation.platform,
      source_model: conversation.model,
      capture_method: 'dom_scrape' as const,
      summary,
      topics: summaryData.topics,
      entities: summaryData.entities,
      snippet_count: conversation.turns.length,
      token_count_original: originalTokens,
      token_count_bundle: bundleTokens,
      compression_ratio: bundleTokens / originalTokens,
      compression_profile: profile,
      hmac_sha256: 'placeholder-will-be-computed-client-side',
    };

    const processingTimeMs = Date.now() - startTime;

    fastify.log.info(`Compression complete: ${processingTimeMs}ms, ratio=${bundle.compression_ratio.toFixed(3)}`);

    return {
      bundle,
      processingTimeMs,
      apiCostUsd: profileConfig.estimatedApiCostUsd,
    };
  });
}

function estimateTokens(text: string): number {
  // Rough estimation: ~4 chars per token for English text
  return Math.ceil(text.length / 4);
}
