import { NextResponse } from 'next/server';
import { getAttractions } from '@/services/contentService';
import { initializeFirebase } from '@/lib/firebase';

// Firebase 초기화
initializeFirebase();

export async function GET() {
  try {
    const data = await getAttractions({ limit: 20 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '명소 목록을 불러오는 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
