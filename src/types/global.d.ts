// 전역 타입 선언
interface Window {
  // 브라우저 전역 변수
}

declare namespace NodeJS {
  interface Global {
    // Node.js 전역 변수
    _firebaseInitialized?: boolean;
    firebaseApp?: import('firebase/app').FirebaseApp;
    firestoreDb?: import('firebase/firestore').Firestore;
  }
}

// 전역 변수 선언
declare const global: NodeJS.Global & typeof globalThis;
