import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';

// Firebase 구성 객체
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// 전역 변수에 Firebase 앱 인스턴스 저장
declare global {
  var firebaseApp: FirebaseApp | undefined;
  var firestoreClient: Firestore | undefined;
}

/**
 * Firebase 앱을 초기화하고 반환합니다.
 * 클라이언트 사이드에서만 사용해야 합니다.
 */
const initializeFirebase = (): FirebaseApp => {
  // 이미 초기화된 경우 기존 인스턴스 반환
  if (typeof window === 'undefined') {
    throw new Error('클라이언트 사이드에서만 사용 가능합니다.');
  }

  if (global.firebaseApp) {
    return global.firebaseApp;
  }

  // Firebase 앱 초기화 (싱글톤 패턴)
  const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // 개발 환경에서만 에뮬레이터 설정
  if (process.env.NODE_ENV === 'development') {
    try {
      // Firestore 에뮬레이터 설정 (클라이언트용 포트 8080)
      const firestore = getFirestore(firebaseApp);
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      console.log('Firestore 클라이언트 에뮬레이터에 연결되었습니다.');
    } catch (error) {
      console.warn('Firestore 에뮬레이터 연결 실패:', error);
    }
  }

  // 전역 변수에 저장하여 핫 리로드 시 재초기화 방지
  global.firebaseApp = firebaseApp;
  
  return firebaseApp;
};

// Firebase 앱 초기화
const firebaseApp = initializeFirebase();

// Firestore 인스턴스 생성 및 내보내기
export const firestore = (() => {
  if (typeof window === 'undefined') {
    throw new Error('firestore는 클라이언트 사이드에서만 사용할 수 있습니다. 서버사이드에서는 firebase-admin을 사용하세요.');
  }
  
  if (!global.firestoreClient) {
    global.firestoreClient = getFirestore(firebaseApp);
  }
  
  return global.firestoreClient;
})();

// 기본 내보내기로 firestore 인스턴스 제공
export default firestore;
