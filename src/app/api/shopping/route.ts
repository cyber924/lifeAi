import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/lib/firebase';

// Firebase 초기화
initializeFirebase();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 1000000;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const searchQuery = searchParams.get('searchQuery') || '';

    // 실제 구현에서는 이 파라미터들을 사용하여 필터링 및 정렬을 수행
    const products = await getShoppingProducts({
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      searchQuery,
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching shopping products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shopping products' },
      { status: 500 }
    );
  }
}

// 임시 함수 - 실제 구현에서는 contentService.ts로 이동
async function getShoppingProducts(filters: {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}) {
  // TODO: 실제 DB 쿼리로 대체
  return [];
}
