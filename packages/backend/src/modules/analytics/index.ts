import type { FastifyInstance } from 'fastify';

export default async function analyticsModule(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request, reply) => {
    await (fastify as any).verifyFirebaseToken(request, reply);
  });

  fastify.get('/usage', async (request) => {
    const { uid } = request.firebaseUser;
    const usage = await fastify.pg.query(
      `SELECT COALESCE(SUM(tokens_consumed), 0) as total_consumed FROM token_usage_log WHERE user_id = $1 AND created_at >= date_trunc('month', NOW())`,
      [uid]
    );
    const bundles = await fastify.pg.query(
      `SELECT COUNT(*) as total, COALESCE(SUM(token_count_original - token_count_bundle), 0) as saved FROM toffee_bundles WHERE user_id = $1`,
      [uid]
    );
    const injections = await fastify.pg.query(
      `SELECT COUNT(*) as total, COALESCE(SUM(tokens_injected), 0) as tokens FROM injection_events WHERE user_id = $1`,
      [uid]
    );
    return {
      totalTokensConsumed: parseInt(usage.rows[0].total_consumed),
      totalTokensSaved: parseInt(bundles.rows[0].saved),
      estimatedCostSavingsUsd: parseInt(bundles.rows[0].saved) * 0.000003,
      bundlesCreated: parseInt(bundles.rows[0].total),
      injectionsPerformed: parseInt(injections.rows[0].total),
    };
  });
}
