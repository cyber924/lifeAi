import { NextResponse } from 'next/server';
import { getFirestore, collection, query, getDocs, where, or } from 'firebase/firestore';
import { initializeFirebase } from '@/lib/firebase';

export async function GET() {
  try {
    console.log('[/api/categories] Fetching categories...');
    // Firebase 초기화
    const { db } = initializeFirebase();
    
    // published된 문서들 중에서 카테고리만 고유하게 조회
    const q = query(
      collection(db, 'prepared_contents'),
      where('is_published', '==', true)
    );
    
    console.log('[/api/categories] Executing Firestore query...');
    const snapshot = await getDocs(q);
    console.log(`[/api/categories] Found ${snapshot.size} documents`);
    
    // 모든 문서에서 카테고리 수집
    const categories = new Set<string>();
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data?.category) {
        categories.add(data.category);
      }
    });
    
    const categoriesArray = Array.from(categories);
    console.log('[/api/categories] Found categories:', categoriesArray);
    
    // Set appropriate headers to prevent caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    // Set을 배열로 변환하여 응답
    return new NextResponse(JSON.stringify({
      success: true,
      data: categoriesArray
    }), {
      status: 200,
      headers: {
        ...Object.fromEntries(headers),
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: '카테고리를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
