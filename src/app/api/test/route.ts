import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/lib/firebase';

export async function GET() {
  try {
    // Firebase 초기화
    const app = initializeFirebase();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase 초기화 성공',
      app: {
        name: app.name,
        options: app.options
      }
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
