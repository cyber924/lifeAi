import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET() {
  try {
    console.log('[add-sample-data] Attempting to add document to prepared_contents...');
    const sampleData = {
      title: '가성비 최고! 스마트폰 필수 액세서리 5선',
      description: '당신의 스마트폰 경험을 한 단계 업그레이드해 줄 필수 액세서리들을 모았습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1554445384-5351d5c2c78c?q=80&w=1887&auto=format&fit=crop',
      category: '쇼핑',
      contentType: 'recommendation',
      tags: ['스마트폰', '액세서리', '가성비', '쇼핑'],
      is_published: true,
      views: 0,
      likes: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      fullContent: {
        items: [
          { type: 'product', name: '고속 무선 충전기', description: '케이블 없이 빠르고 편리하게 충전하세요.', price: '25,000원' },
          { type: 'product', name: '슬림핏 케이스', description: '보호 기능은 물론, 스마트폰의 디자인을 해치지 않습니다.', price: '15,000원' },
          { type: 'product', name: '블루투스 이어폰', description: '선으로부터의 자유, 뛰어난 음질을 경험해보세요.', price: '79,000원' },
          { type: 'product', name: '강화유리 필름', description: '스크래치와 충격으로부터 액정을 완벽하게 보호합니다.', price: '12,000원' },
          { type: 'tip', content: '온라인 쇼핑몰에서 쿠폰을 활용하면 더 저렴하게 구매할 수 있습니다.' }
        ]
      }
    };

    console.log('[add-sample-data] Data to be added:', sampleData);
    const docRef = await db.collection('prepared_contents').add(sampleData);
    console.log('[add-sample-data] addDoc successful, document ID:', docRef.id);

    return NextResponse.json({
      message: '샘플 데이터가 성공적으로 추가되었습니다.',
      documentId: docRef.id,
    });

  } catch (error) {
    console.error('[add-sample-data] Error in try block:', error);
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      console.error('[add-sample-data] Firestore error code:', error.code);
      console.error('[add-sample-data] Firestore error message:', error.message);
    } else {
      console.error('[add-sample-data] Non-Firestore error or unknown error structure');
    }
    return NextResponse.json({
      message: '샘플 데이터 추가 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
