import { NextResponse } from 'next/server';
import { getContentById } from '@/services/contentService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const content = await getContentById(params.id);
    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '콘텐츠를 불러오는 중 오류가 발생했습니다.' 
      },
      { status }
    );
  }
}

export const dynamic = 'force-dynamic';
