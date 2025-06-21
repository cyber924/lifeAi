import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET() {
  try {
    const sampleData = {
      title: '부산 오션뷰 감성 숙소 추천',
      description: '아름다운 바다 전망과 함께 편안한 휴식을 즐길 수 있는 최고의 숙소입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1887&auto=format&fit=crop',
      category: '숙소',
      contentType: 'recommendation',
      tags: ['부산', '숙소', '오션뷰', '감성'],
      is_published: true,
      views: 0,
      likes: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      fullContent: {
        name: '오션테라스 호텔',
        address: '부산광역시 해운대구',
        priceRange: '1박 150,000원 ~ 300,000원',
        rating: 4.5,
        amenities: ['WiFi', '수영장', '조식 포함', '피트니스 센터'],
        description: '해운대 해변 바로 앞에 위치하여 환상적인 오션뷰를 자랑합니다. 모던한 인테리어와 최상의 서비스로 특별한 경험을 선사합니다.'
      }
    };

    const docRef = await db.collection('prepared_contents').add(sampleData);

    return NextResponse.json({
      message: '숙소 샘플 데이터가 성공적으로 추가되었습니다.',
      documentId: docRef.id,
    });

  } catch (error) {
    console.error('Error adding accommodation sample data:', error);
    return NextResponse.json({
      message: '숙소 샘플 데이터 추가 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
