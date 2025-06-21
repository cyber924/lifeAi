import { NextResponse } from 'next/server';
import { getAccommodations } from '@/services/contentService';
import { initializeFirebase } from '@/lib/firebase';

// Firebase 초기화
initializeFirebase();

export async function GET() {
  try {
    console.log('Fetching accommodations...');
    const data = await getAccommodations({ limit: 20 });
    console.log('Successfully fetched accommodations:', data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in GET /api/accommodations:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '숙소 목록을 불러오는 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
