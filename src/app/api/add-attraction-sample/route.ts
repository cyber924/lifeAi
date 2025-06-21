import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function GET() {
  try {
    const sampleData = {
      title: '부산의 알록달록한 예술 마을, 감천문화마을',
      description: '한국의 마추픽추라 불리는 감천문화마을에서 특별한 추억을 만들어보세요.',
      imageUrl: 'https://images.unsplash.com/photo-1559900935-d8935c59b154?q=80&w=1887&auto=format&fit=crop',
      category: '명소',
      contentType: 'recommendation',
      tags: ['부산', '명소', '감천문화마을', '사진'],
      is_published: true,
      views: 0,
      likes: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      fullContent: {
        name: '감천문화마을',
        address: '부산광역시 사하구 감내2로 203',
        operatingHours: '09:00 ~ 18:00',
        admissionFee: '무료 (체험 프로그램 별도)',
        photoSpots: ['어린왕자와 사막여우', '알록달록한 계단', '하늘마루 전망대'],
        description: '파스텔톤의 계단식 주택과 골목길 사이사이에 숨어있는 예술 작품들이 어우러져 동화 같은 풍경을 자아내는 곳입니다.'
      }
    };

    const docRef = await addDoc(collection(db, 'prepared_contents'), sampleData);

    return NextResponse.json({
      message: '명소 샘플 데이터가 성공적으로 추가되었습니다.',
      documentId: docRef.id,
    });

  } catch (error) {
    console.error('Error adding attraction sample data:', error);
    return NextResponse.json({
      message: '명소 샘플 데이터 추가 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
