import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { sseService } from '../../services/sse.service.js';

const eventsModule: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // We use standard Fastify hooks, requiring a valid Firebase Token to connect
  fastify.addHook('onRequest', fastify.verifyFirebaseToken);

  fastify.get('/stream', async (request, reply) => {
    const userId = request.firebaseUser.uid;

    // Explicitly set CORS headers because we bypass Fastify's response lifecycle
    const origin = request.headers.origin;
    if (origin) {
      reply.raw.setHeader('Access-Control-Allow-Origin', origin);
      reply.raw.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Set headers for Server-Sent Events
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    // Ensure the connection doesn't time out
    reply.raw.flushHeaders();

    // Register this client connection
    sseService.addClient(userId, reply);

    // Keep the fastify request open indefinitely
    // We send an empty reply stream instead of resolving normally
    return reply;
  });
};

export default eventsModule;
