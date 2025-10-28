/**
 *  MIDDLEWARE DESHABILITADO TEMPORALMENTE
 * 
 * Causa: EvalError: Code generation from strings disallowed for this context
 * Este error es común con Edge Runtime en Docker
 */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware deshabilitado - pasar todas las solicitudes
  return NextResponse.next();
}

export const config = {
  matcher: []  // No aplicar a ninguna ruta
};