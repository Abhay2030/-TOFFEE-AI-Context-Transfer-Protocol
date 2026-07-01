// ============================================================
// Firebase Admin SDK — Server-side Token Verification
// ============================================================

import { initializeApp, getApps, cert, applicationDefault, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from './env.js';

let app: App;

if (getApps().length === 0) {
  const serviceAccount = env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  app = initializeApp({
    credential: serviceAccount
      ? cert(serviceAccount)
      : applicationDefault(),
    projectId: env.FIREBASE_PROJECT_ID,
  });
} else {
  app = getApps()[0];
}

export const firebaseAuth = getAuth(app);
