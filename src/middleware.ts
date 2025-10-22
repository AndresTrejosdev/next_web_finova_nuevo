/**
 *  MIDDLEWARE DE VERIFICACIÓN CRÍTICA
 * 
 * Verifica variables de entorno al startup de la aplicación
 * Previene errores 500 en producción
 */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Solo verificar en rutas de API críticas
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      
      const criticalVars = [
        'NEXT_PUBLIC_API_URL',
        'NEXT_PUBLIC_PANEL_URL',
        'NEXT_PUBLIC_PAYVALIDA_API', 
        'NEXT_PUBLIC_GOPAGOS_API',
        'NEXT_PUBLIC_RETURN_URL',
        'NEXT_PUBLIC_CANCEL_URL'
      ];

      const missing = criticalVars.filter(varName => !process.env[varName]);

      if (missing.length > 0) {
        console.error('VARIABLES DE ENTORNO CRÍTICAS FALTANTES:', missing);
        
        return NextResponse.json(
          { 
            error: 'Configuración del servidor incompleta',
            message: 'Variables de entorno críticas no configuradas',
            missing: missing,
            code: 'ENV_VARS_MISSING'
          },
          { status: 503 } // Service Unavailable
        );
      }

      // Validar formato de URLs
      const urlVars = [
        'NEXT_PUBLIC_API_URL',
        'NEXT_PUBLIC_PANEL_URL', 
        'NEXT_PUBLIC_PAYVALIDA_API',
        'NEXT_PUBLIC_GOPAGOS_API'
      ];

      for (const varName of urlVars) {
        const url = process.env[varName];
        if (url && !url.startsWith('http')) {
          console.error(`URL INVÁLIDA en ${varName}:`, url);
          
          return NextResponse.json(
            { 
              error: 'Configuración de URL inválida',
              message: `${varName} debe comenzar con http:// o https://`,
              value: url,
              code: 'INVALID_URL_FORMAT'
            },
            { status: 503 }
          );
        }
      }

    } catch (error: any) {
      console.error('Error en middleware de validación:', error);
      
      return NextResponse.json(
        { 
          error: 'Error de configuración del servidor',
          message: error.message,
          code: 'MIDDLEWARE_ERROR'
        },
        { status: 503 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/credito/:path*',
    '/api/payvalida/:path*', 
    '/api/gopagos/:path*'
  ]
};