import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// 이 API 라우트의 캐시를 비활성화합니다.
// 이렇게 하면 항상 최신 데이터를 가져옵니다.
export const revalidate = 0;

// Define a type for our data to help TypeScript
interface Recommendation {
  id: string;
  category: string;
  [key: string]: any; // Allow other properties
}

export async function GET() {
  try {
    const q = db
      .collection('prepared_contents')
      .where('is_published', '==', true)
      .where('contentType', '==', 'recommendation');

    const querySnapshot = await q.get();
    const recommendations = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as Recommendation;
    });

    console.log(
      '[API] Fetched recommendations:', 
      recommendations.map((r: Recommendation) => ({
        id: r.id, 
        category: r.category
      }))
    );

    // Define allowed categories
    const allowedCategories = ['여행', '맛집', '쇼핑', '숙소', '명소'];

    // Filter in the backend to avoid composite index issues
    const filteredRecommendations = recommendations.filter((rec: Recommendation) => 
      allowedCategories.includes(rec.category)
    );

    console.log('[API] Filtered recommendations:', filteredRecommendations.map(r => ({id: r.id, category: r.category})));

    return NextResponse.json(filteredRecommendations);

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
