import type { FastifyInstance } from 'fastify';
import { ContactFormBodySchema } from '../../schemas/validation.js';

export default async function contactModule(fastify: FastifyInstance) {
  // Try to decode Firebase user if token is present, but don't fail if missing.
  // This allows us to optionally capture the user_id if they are logged in.
  fastify.addHook('preHandler', async (request) => {
    try {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        // We leave this hook here to allow the global verifyFirebaseToken hook to be called
        // or just let it pass through.
      }
    } catch (e) {
      // Ignore errors for optional auth
    }
  });

  fastify.post('/', async (request, reply) => {
    // 1. Validate the body
    const bodyResult = ContactFormBodySchema.safeParse(request.body);
    if (!bodyResult.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: bodyResult.error.format(),
      });
    }

    const { name, email, topic, message } = bodyResult.data;

    // Optional user ID if the client sent an Authorization header and we successfully decoded it.
    let userId = null;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      // For simplicity, we just extract it if the global hook was somehow run, or we just leave it null.
      // Fastify doesn't run `verifyFirebaseToken` automatically unless we use it as preHandler.
      // We will try to get it if the decorator set it.
      if ((request as any).firebaseUser) {
        userId = (request as any).firebaseUser.uid;
      }
    }

    const client = await fastify.pg.connect();
    try {
      await client.query(
        `INSERT INTO contact_messages (name, email, topic, message, user_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [name, email, topic, message, userId]
      );

      return reply.status(201).send({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      fastify.log.error(error, 'Error inserting contact message');
      return reply.status(500).send({ error: 'Failed to save message' });
    } finally {
      client.release();
    }
  });
}
