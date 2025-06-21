import { NextResponse } from 'next/server';
import { getContents, GetContentsOptions } from '@/services/contentService';
// Firebase Admin SDK는 자동으로 초기화되므로 별도 초기화 불필요

// 요청 파라미터 타입 정의
interface ContentsRequestParams {
  category?: string;
  pageSize?: number;
  lastVisibleId?: string;
  tags?: string[];
}

/**
 * 컨텐츠 목록 조회 API
 * GET /api/contents?category=카테고리&pageSize=10&lastVisibleId=마지막문서ID&tags=태그1,태그2
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 요청 파라미터 파싱 및 유효성 검사
    const params: GetContentsOptions = {
      category: searchParams.get('category') || undefined,
      pageSize: Number(searchParams.get('pageSize')) || 10,
      lastVisibleId: searchParams.get('lastVisibleId') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || []
    };

    // 페이지 크기 제한 (최대 50개)
    if (params.pageSize > 50) {
      params.pageSize = 50;
    }

    // 서비스 계층 호출 (이미 JSON-safe한 데이터 반환)
    const result = await getContents(params);
    
    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      data: result.docs,
      pagination: {
        hasNext: result.hasNext,
        lastVisibleId: result.lastVisibleId,
        size: result.size
      }
    });
  } catch (error: any) {
    // 에러 로깅 (개발 환경에서만 상세 로그 출력)
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
    }
    
    // 클라이언트에 반환할 에러 응답
    const errorResponse = {
      success: false,
      error: {
        message: error.message || '서버 오류가 발생했습니다.',
        code: error.code || 'internal/error',
        // 개발 환경에서만 상세 에러 정보 포함
        ...(process.env.NODE_ENV === 'development' && {
          details: {
            name: error.name,
            stack: error.stack,
            ...(error.details && { firebaseError: error.details })
          }
        })
      }
    };
    
    return NextResponse.json(errorResponse, {
      status: error.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const dynamic = 'force-dynamic'; // Disable caching for this route