import * as admin from 'firebase-admin';

// 글로벌 키 정의 (Next.js 핫 리로드에서도 유지)
const FIREBASE_ADMIN_KEY = Symbol.for('com.your-app.firebase-admin');
const FIRESTORE_DB_KEY = Symbol.for('com.your-app.firestore-db');

type GlobalWithFirebase = typeof globalThis & {
  [FIREBASE_ADMIN_KEY]?: admin.app.App;
  [FIRESTORE_DB_KEY]?: admin.firestore.Firestore;
};

/**
 * Firebase Admin 앱 인스턴스를 싱글톤으로 가져옵니다.
 * ✅ 경로 대신 cert 필드 직접 사용 (Vercel 안전)
 */
const getFirebaseAdmin = (): admin.app.App => {
  const globalWithFirebase = globalThis as GlobalWithFirebase;

  // 이미 초기화된 인스턴스가 있다면 재사용
  if (globalWithFirebase[FIREBASE_ADMIN_KEY]) {
    return globalWithFirebase[FIREBASE_ADMIN_KEY]!;
  }

  try {
    if (admin.apps.length === 0) {
      console.log('✅ Initializing Firebase Admin with cert fields...');
      globalWithFirebase[FIREBASE_ADMIN_KEY] = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } else {
      console.log('Reusing existing Firebase Admin instance...');
      globalWithFirebase[FIREBASE_ADMIN_KEY] = admin.app();
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error(
      `Failed to initialize Firebase Admin: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  return globalWithFirebase[FIREBASE_ADMIN_KEY]!;
};

/**
 * Firestore 데이터베이스 인스턴스를 싱글톤으로 가져옵니다.
 */
const getFirestoreDb = (): admin.firestore.Firestore => {
  const globalWithFirebase = globalThis as GlobalWithFirebase;

  if (!globalWithFirebase[FIRESTORE_DB_KEY]) {
    console.log('Initializing Firestore instance...');

    try {
      globalWithFirebase[FIRESTORE_DB_KEY] = getFirebaseAdmin().firestore();

      // 개발 환경에서의 설정
      if (process.env.NODE_ENV === 'development') {
        globalWithFirebase[FIRESTORE_DB_KEY]!.settings({
          ignoreUndefinedProperties: true,
        });
      }

      console.log('Firestore initialized successfully');
    } catch (error) {
      console.error('Firestore initialization error:', error);
      throw new Error(
        `Failed to initialize Firestore: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return globalWithFirebase[FIRESTORE_DB_KEY]!;
};

// 기본 Firestore 인스턴스 (기존 코드와의 호환성을 위해 유지)
const db = getFirestoreDb();

export { db, getFirebaseAdmin, getFirestoreDb };
