import * as admin from 'firebase-admin';
import { products } from '../src/data/shopping';

// Firebase Admin 초기화
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

async function seedProducts() {
  try {
    console.log('Starting to seed products to Firestore...');
    
    // 배치 작업 시작 (여러 문서를 한 번에 처리하기 위해)
    const batch = db.batch();
    const productsRef = db.collection('products');
    
    // 새 상품 데이터 추가
    products.forEach((product) => {
      const productRef = productsRef.doc(product.id);
      batch.set(productRef, {
        ...product,
        // Firestore에 저장하기 전에 필요한 형식으로 데이터 변환
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    
    // 배치 작업 실행
    await batch.commit();
    console.log(`Successfully seeded ${products.length} products to Firestore!`);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedProducts();
