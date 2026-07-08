// ============================================================
// Toffee Backend — Fastify Server Bootstrap
// ============================================================

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { env } from './config/env.js';
import { firebaseAuth } from './config/firebase.js';

// Module imports
import authModule from './modules/auth/index.js';
import bundlesModule from './modules/bundles/index.js';
import compressionModule from './modules/compression/index.js';
import sharingModule from './modules/sharing/index.js';
import analyticsModule from './modules/analytics/index.js';
import eventsModule from './modules/events/index.js';
import contactModule from './modules/contact/index.js';
// Plugin imports
import postgresPlugin from './plugins/postgres.js';
import redisPlugin from './plugins/redis.js';

// ── Firebase Auth Types ──────────────────────────────────────
declare module 'fastify' {
  interface FastifyRequest {
    firebaseUser: {
      uid: string;
      email?: string;
      name?: string;
    };
  }
  interface FastifyInstance {
    verifyFirebaseToken: any;
  }
}

const app = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
  bodyLimit: 10485760, // 10MB limit
});

async function bootstrap() {
  // ── Security Plugins ──────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    },
  });

  await app.register(cors, {
    origin: (origin, cb) => {
      // In development, allow all
      if (env.NODE_ENV !== 'production') {
        return cb(null, true);
      }
      
      // In production, allow web app and specific extension
      const allowedOrigins = [
        'https://toffee.ai',
        'https://toffee-ai-context-transfer-protocol-red.vercel.app'
      ];
      
      // Also allow any dynamic Vercel preview URLs
      const isVercelPreview = origin && origin.endsWith('.vercel.app');
      
      if (env.EXTENSION_ID) {
        allowedOrigins.push(`chrome-extension://${env.EXTENSION_ID}`);
      } else {
        // Fallback for safety if no specific ID provided, but warn
        app.log.warn('No EXTENSION_ID provided in env, allowing all chrome extensions in CORS.');
        allowedOrigins.push('chrome-extension://*');
      }

      if (!origin || allowedOrigins.includes(origin) || isVercelPreview || (allowedOrigins.includes('chrome-extension://*') && origin.startsWith('chrome-extension://'))) {
        return cb(null, true);
      }
      cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (request) => {
      return request.headers['x-forwarded-for'] as string || request.ip;
    },
  });

  // ── Firebase Auth Decorator ────────────────────────────────
  app.decorateRequest('firebaseUser', undefined as unknown as { uid: string; email?: string; name?: string });

  app.decorate('verifyFirebaseToken', async (request: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply) => {
    const authHeader = request.headers.authorization;
    let idToken = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      idToken = authHeader.substring(7);
    } else if (request.query && (request.query as any).token) {
      idToken = (request.query as any).token;
    }

    if (!idToken) {
      return reply.status(401).send({ error: 'Missing or invalid authorization header or token query parameter' });
    }

    try {
      const decoded = await firebaseAuth.verifyIdToken(idToken);
      request.firebaseUser = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      };
    } catch (err) {
      app.log.warn({ err }, 'Firebase token verification failed');
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  });

  // ── API Docs ───────────────────────────────────────────────
  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Toffee API',
        description: 'AI Context Transfer Protocol — Backend API',
        version: '1.0.0',
      },
      servers: [
        { url: `http://localhost:${env.PORT}`, description: 'Development' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'Firebase ID Token',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // ── Data Layer Plugins ─────────────────────────────────────
  await app.register(postgresPlugin);
  await app.register(redisPlugin);

  // ── Business Modules ───────────────────────────────────────
  await app.register(authModule, { prefix: '/v1/auth' });
  await app.register(bundlesModule, { prefix: '/v1/bundles' });
  await app.register(compressionModule, { prefix: '/v1' });
  await app.register(sharingModule, { prefix: '/v1' });
  await app.register(analyticsModule, { prefix: '/v1/analytics' });
  await app.register(eventsModule, { prefix: '/v1/events' });
  await app.register(contactModule, { prefix: '/v1/contact' });

  // ── Health Check ───────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }));

  // ── Global Error Handler ───────────────────────────────────
  app.setErrorHandler((error: import('fastify').FastifyError, request, reply) => {
    const statusCode = error.statusCode || 500;

    app.log.error({
      err: error,
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
      },
    });

    reply.status(statusCode).send({
      error: statusCode >= 500 ? 'Internal Server Error' : error.message,
      statusCode,
      ...(env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  });

  // ── Start Server ───────────────────────────────────────────
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 Toffee API running on http://localhost:${env.PORT}`);
    app.log.info(`📚 API Docs: http://localhost:${env.PORT}/docs`);
  } catch (err) {
    app.log.fatal(err);
    process.exit(1);
  }
}

bootstrap();
