import * as admin from 'firebase-admin';
import path from 'path';

// 글로벌 키 정의 (Next.js 핫 리로드에서도 유지)
const FIREBASE_ADMIN_KEY = Symbol.for('com.your-app.firebase-admin');
const FIRESTORE_DB_KEY = Symbol.for('com.your-app.firestore-db');

type GlobalWithFirebase = typeof globalThis & {
  [FIREBASE_ADMIN_KEY]?: admin.app.App;
  [FIRESTORE_DB_KEY]?: admin.firestore.Firestore;
};

// 서비스 계정 파일 경로 확인
const getServiceAccountPath = (): string => {
  // 환경변수에서 경로 가져오기 (기본값: 프로젝트 루트의 service-account.json)
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
    path.join(process.cwd(), 'config/service-account.json');
  
  console.log(`Using service account file: ${serviceAccountPath}`);
  return serviceAccountPath;
};

/**
 * Firebase Admin 앱 인스턴스를 싱글톤으로 가져옵니다.
 * Next.js 개발 모드의 핫 리로드에서도 안정적으로 작동합니다.
 */
const getFirebaseAdmin = (): admin.app.App => {
  const globalWithFirebase = globalThis as GlobalWithFirebase;
  
  // 이미 초기화된 인스턴스가 있다면 재사용
  if (globalWithFirebase[FIREBASE_ADMIN_KEY]) {
    return globalWithFirebase[FIREBASE_ADMIN_KEY]!;
  }

  try {
    // Firebase Admin 초기화
    if (admin.apps.length === 0) {
      console.log('Initializing new Firebase Admin instance...');
      
      // 서비스 계정 파일을 직접 로드하는 대신, 파일 경로만 전달
      // GOOGLE_APPLICATION_CREDENTIALS 환경변수에 파일 경로가 설정되어 있어야 함
      globalWithFirebase[FIREBASE_ADMIN_KEY] = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      
      console.log('Firebase Admin initialized successfully');
    } else {
      // 이미 초기화된 앱이 있다면 해당 앱 사용
      console.log('Reusing existing Firebase Admin instance...');
      globalWithFirebase[FIREBASE_ADMIN_KEY] = admin.app();
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error(`Failed to initialize Firebase Admin: ${error instanceof Error ? error.message : String(error)}`);
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
      throw new Error(`Failed to initialize Firestore: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return globalWithFirebase[FIRESTORE_DB_KEY]!;
};

// 기본 Firestore 인스턴스 (기존 코드와의 호환성을 위해 유지)
const db = getFirestoreDb();

export { db, getFirebaseAdmin, getFirestoreDb };
