import { NextRequest, NextResponse } from 'next/server';

/**
 * 🧪 ENDPOINT DE PRUEBAS PARA CASOS DE CRÉDITOS
 * 
 * URL: GET /api/debug/credito-cases?caso=TIPO&documento=CEDULA
 * 
 * Simula diferentes casos para testing sin afectar datos reales
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const caso = searchParams.get('caso');
  const documento = searchParams.get('documento') || '12345678';

  // Solo permitir en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Endpoint de debug no disponible en producción' },
      { status: 403 }
    );
  }

  const baseMetadata = {
    documento,
    consultaFecha: new Date().toISOString(),
  };

  switch (caso) {
    case 'NO_CREDITS_FOUND':
      return NextResponse.json(
        {
          creditos: [],
          error: 'NO_CREDITS_FOUND',
          message: 'No se encontraron créditos para este documento',
          metadata: {
            ...baseMetadata,
            totalEncontrados: 0,
            totalEnCurso: 0,
            estadosEncontrados: [],
            tiposCredito: []
          }
        },
        { status: 404 }
      );

    case 'NO_ACTIVE_CREDITS':
      return NextResponse.json(
        {
          creditos: [],
          error: 'NO_ACTIVE_CREDITS',
          message: 'Se encontraron 2 crédito(s) pero ninguno está EN CURSO. Estados encontrados: FINALIZADO, CANCELADO',
          metadata: {
            ...baseMetadata,
            totalEncontrados: 2,
            totalEnCurso: 0,
            estadosEncontrados: ['FINALIZADO', 'CANCELADO'],
            tiposCredito: ['CRÉDITO EXPRESS', 'AMORTIZACIÓN']
          },
          creditosInactivos: [
            {
              prestamo_ID: 12345,
              tipoCredito: 'CRÉDITO EXPRESS',
              estado: 'FINALIZADO'
            },
            {
              prestamo_ID: 67890,
              tipoCredito: 'AMORTIZACIÓN',
              estado: 'CANCELADO'
            }
          ]
        },
        { status: 200 }
      );

    case 'TIMEOUT_ERROR':
      return NextResponse.json(
        {
          error: 'Tiempo de espera agotado después de múltiples intentos',
          message: 'Los servicios están experimentando alta demanda. Intenta nuevamente en unos minutos.',
          code: 'TIMEOUT_AFTER_RETRIES',
          retryAfter: 60
        },
        { status: 504 }
      );

    case 'CONNECTIVITY_ERROR':
      return NextResponse.json(
        {
          error: 'Error de conectividad con los servicios',
          message: 'No se pudo establecer conexión con los servidores. Verifica tu conexión e intenta nuevamente.',
          code: 'CONNECTIVITY_ERROR',
          retryAfter: 30
        },
        { status: 503 }
      );

    case 'CREDITOS_ACTIVOS':
      return NextResponse.json([
        {
          prestamo_ID: 12345,
          tipoCredito: 'CRÉDITO EXPRESS',
          estado: 'EN CURSO',
          pagoMinimo: 50000,
          pagoTotal: 250000,
          pagoEnMora: 0,
          documento,
          nombreCompleto: 'Cliente de Prueba',
          email: 'prueba@finova.com.co',
          telefono: '3001234567',
          ciudad: 'Bogotá',
          amortizacion: [
            {
              fecha: '2024-01-15',
              valorCuota: 50000,
              mora: 0,
              sancion: 0,
              estado: 'PENDIENTE'
            },
            {
              fecha: '2024-02-15', 
              valorCuota: 50000,
              mora: 0,
              sancion: 0,
              estado: 'PAGADA'
            }
          ],
          esAmortizacion: false,
          esExpressCredito: true
        }
      ]);

    default:
      return NextResponse.json(
        {
          error: 'Caso de prueba no válido',
          casosDisponibles: [
            'NO_CREDITS_FOUND',
            'NO_ACTIVE_CREDITS', 
            'TIMEOUT_ERROR',
            'CONNECTIVITY_ERROR',
            'CREDITOS_ACTIVOS'
          ],
          uso: '/api/debug/credito-cases?caso=NO_CREDITS_FOUND&documento=12345678'
        },
        { status: 400 }
      );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Método no permitido. Usar GET.' },
    { status: 405 }
  );
}