import { NextRequest, NextResponse } from 'next/server';
import { validateEnvironment } from '@/lib/validators';

export async function GET() {
  try {
    validateEnvironment();
    
    const envStatus = {
      NEXT_PUBLIC_API_URL: !!process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_PANEL_URL: !!process.env.NEXT_PUBLIC_PANEL_URL,
      NEXT_PUBLIC_PAYVALIDA_API: !!process.env.NEXT_PUBLIC_PAYVALIDA_API,
      NEXT_PUBLIC_RETURN_URL: !!process.env.NEXT_PUBLIC_RETURN_URL,
      NEXT_PUBLIC_CANCEL_URL: !!process.env.NEXT_PUBLIC_CANCEL_URL
    };

    return NextResponse.json({
      status: 'success',
      message: 'Todas las variables de entorno están configuradas',
      environment: envStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}