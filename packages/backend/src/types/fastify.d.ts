import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    verifyFirebaseToken: (request: any, reply: any) => Promise<void>;
  }
}
