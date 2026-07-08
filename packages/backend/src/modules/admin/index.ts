import type { FastifyInstance } from 'fastify';

export default async function adminModule(fastify: FastifyInstance) {
  // Auth & Admin preHandler for all routes in this module
  fastify.addHook('preHandler', async (request, reply) => {
    // 1. Verify the user is authenticated via Firebase
    await (fastify as any).verifyFirebaseToken(request, reply);
    
    // 2. Verify the authenticated user is the designated admin
    if (request.firebaseUser.email !== 'abhaydonde2007@gmail.com') {
      return reply.status(403).send({ error: 'Forbidden: Admin access only' });
    }
  });

  // ── GET /contact/messages — List all contact messages ────────────────────
  fastify.get('/contact/messages', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const result = await client.query(
        'SELECT * FROM contact_messages ORDER BY created_at DESC'
      );
      
      return reply.status(200).send({ messages: result.rows });
    } catch (error) {
      fastify.log.error(error, 'Error fetching contact messages');
      return reply.status(500).send({ error: 'Failed to fetch messages' });
    } finally {
      client.release();
    }
  });
}
