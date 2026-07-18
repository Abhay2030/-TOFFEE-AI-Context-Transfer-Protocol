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
    const timeseries = await fastify.pg.query(
      `
      WITH dates AS (
        SELECT generate_series(
          date_trunc('day', NOW() - INTERVAL '29 days'),
          date_trunc('day', NOW()),
          '1 day'::interval
        ) as dt
      ),
      daily_bundles AS (
        SELECT date_trunc('day', created_at) as dt, SUM(token_count_original - token_count_bundle) as saved
        FROM toffee_bundles WHERE user_id = $1 GROUP BY dt
      ),
      daily_usage AS (
        SELECT date_trunc('day', created_at) as dt, SUM(tokens_consumed) as consumed
        FROM token_usage_log WHERE user_id = $1 GROUP BY dt
      )
      SELECT 
        TO_CHAR(d.dt, 'Mon DD') as date,
        COALESCE(db.saved, 0)::int as "tokensSaved",
        COALESCE(du.consumed, 0)::int as "tokensConsumed"
      FROM dates d
      LEFT JOIN daily_bundles db ON d.dt = db.dt
      LEFT JOIN daily_usage du ON d.dt = du.dt
      ORDER BY d.dt ASC
      `,
      [uid]
    );

    const platforms = await fastify.pg.query(
      `
      SELECT 
        source_platform as name,
        COUNT(*)::int as bundles,
        COALESCE(SUM(token_count_original - token_count_bundle), 0)::int as tokens
      FROM toffee_bundles
      WHERE user_id = $1
      GROUP BY source_platform
      ORDER BY tokens DESC
      `,
      [uid]
    );

    return {
      overview: {
        totalTokensConsumed: parseInt(usage.rows[0].total_consumed),
        totalTokensSaved: parseInt(bundles.rows[0].saved),
        estimatedCostSavingsUsd: parseInt(bundles.rows[0].saved) * 0.000003,
        bundlesCreated: parseInt(bundles.rows[0].total),
        injectionsPerformed: parseInt(injections.rows[0].total),
      },
      timeseries: timeseries.rows,
      platforms: platforms.rows
    };
  });
}
