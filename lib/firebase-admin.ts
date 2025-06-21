// lib/firebase-admin.ts (서버 전용)

import * as admin from 'firebase-admin';

declare global {
  var _firebaseAdmin: admin.app.App | undefined;
}

if (!globalThis._firebaseAdmin) {
  globalThis._firebaseAdmin = admin.apps.length === 0
    ? admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    : admin.app();
}

// ✅ 서버용 Firestore export (이름은 db)
export const db = globalThis._firebaseAdmin.firestore();
export const getFirebaseAdmin = () => globalThis._firebaseAdmin!;
export default db;

