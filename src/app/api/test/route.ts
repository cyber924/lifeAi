import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Firebase Admin SDK 사용 확인을 위해 간단한 쿼리 실행
    const snapshot = await db.collection('test').limit(1).get();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Admin SDK가 정상적으로 작동 중입니다',
      testDocuments: snapshot.size
    });
  } catch (error: any) {
    console.error('Test API Error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || '테스트 중 오류 발생',
        code: error.code || 'test/error',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          stack: error.stack
        } : undefined
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export const dynamic = 'force-dynamic';
