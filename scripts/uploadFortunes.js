// 이 스크립트는 초기 운세 데이터를 Firestore에 업로드합니다.
// 터미널에서 `node scripts/uploadFortunes.js` 명령어로 한 번만 실행하세요.

// .env.local 파일에서 환경 변수를 로드합니다.
require('dotenv').config({ path: './.env.local' });

const admin = require('firebase-admin');

// --- 업로드할 데이터 ---
const fortunes = [
  {
    date: "2025-06-15",
    message: "오늘은 오랫동안 기다려온 좋은 소식이 도착할 것 같아요. 주변 사람들에게 따뜻한 미소를 나눠주세요.",
    luckyItem: "손수건",
    luckyColor: "하늘색"
  },
  {
    date: "2025-06-16",
    message: "새로운 도전이 당신을 기다리고 있어요. 망설이지 말고 첫발을 내딛는 용기가 필요한 날입니다.",
    luckyItem: "새로운 신발",
    luckyColor: "빨간색"
  },
  {
    date: "2025-06-17",
    message: "뜻밖의 장소에서 귀인을 만나 도움을 받게 될 거예요. 열린 마음으로 사람들을 대하세요.",
    luckyItem: "책",
    luckyColor: "초록색"
  },
  {
    date: "2025-06-18",
    message: "잠시 숨을 고르며 재충전의 시간을 갖기에 완벽한 날입니다. 좋아하는 음악과 함께 휴식을 취하세요.",
    luckyItem: "커피 한 잔",
    luckyColor: "베이지색"
  },
  {
    date: "2025-06-19",
    message: "당신의 아이디어가 빛을 발하는 날! 창의적인 생각을 마음껏 펼쳐 주위 사람들을 놀라게 해주세요.",
    luckyItem: "메모장",
    luckyColor: "노란색"
  },
  {
    date: "2025-06-20",
    message: "금전운이 상승하는 기분 좋은 하루. 작은 지출도 신중하게 결정하면 더 큰 행운이 따를 거예요.",
    luckyItem: "동전 지갑",
    luckyColor: "금색"
  },
  {
    date: "2025-06-21",
    message: "사랑하는 사람들과의 관계가 더욱 깊어지는 날입니다. 먼저 다가가 마음을 표현해 보세요.",
    luckyItem: "작은 선물",
    luckyColor: "분홍색"
  }
];

// --- Firestore 초기화 ---
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY가 .env.local 파일에 설정되지 않았습니다.');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (e) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY 파싱 실패. 유효한 JSON 문자열인지 확인하세요.', e);
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY 형식이 올바르지 않습니다.');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// --- 업로드 로직 ---
async function uploadFortunes() {
  console.log('Firestore에 운세 데이터 업로드를 시작합니다...');
  const batch = db.batch();
  const fortunesCollection = db.collection('fortunes');

  fortunes.forEach(fortune => {
    const docRef = fortunesCollection.doc(fortune.date);
    const { date, ...data } = fortune;
    batch.set(docRef, data);
  });

  try {
    await batch.commit();
    console.log('✅ 성공! 7일 치의 운세 데이터가 Firestore에 모두 업로드되었습니다.');
  } catch (error) {
    console.error('❌ 업로드 중 오류 발생:', error);
  }
}

uploadFortunes();
