import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

/**
 * Firebase 초기화 함수
 * 서버/클라이언트 양쪽에서 안전하게 초기화를 수행합니다.
 */
const initializeFirebase = (): FirebaseApp => {
  // 이미 초기화된 경우 기존 인스턴스 반환
  if (global.firebaseApp) {
    return global.firebaseApp;
  }

  try {
    console.log('Initializing Firebase...');
    
    // Firebase 앱 초기화
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    // 전역 변수에 저장
    global.firebaseApp = app;
    global.firestoreDb = getFirestore(app);
    global._firebaseInitialized = true;
    
    console.log('Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error('Firebase 초기화 중 오류가 발생했습니다.');
  }
};

// Firebase 인스턴스 가져오기
const getFirebaseApp = (): FirebaseApp => {
  if (!global.firebaseApp) {
    throw new Error('Firebase가 초기화되지 않았습니다. 먼저 initializeFirebase()를 호출하세요.');
  }
  return global.firebaseApp;
};

// Firestore 인스턴스 가져오기
const getFirestoreDb = (): Firestore => {
  if (!global.firestoreDb) {
    throw new Error('Firestore가 초기화되지 않았습니다. 먼저 initializeFirebase()를 호출하세요.');
  }
  return global.firestoreDb;
};

export { 
  initializeFirebase, 
  getFirebaseApp, 
  getFirestoreDb as getDb,
  type FirebaseApp 
};

// 기본 내보내기로 initializeFirebase 제공
export default initializeFirebase;
