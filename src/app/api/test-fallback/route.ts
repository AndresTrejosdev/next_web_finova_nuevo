/**
 * ENDPOINT DE PRUEBA: Sistema de Fallback de Pagos
 * 
 * Permite probar diferentes escenarios de fallback sin afectar producción
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  checkPaymentProviderHealth, 
  getAvailablePaymentProvider,
  getRequiredProviderForMethod 
} from '@/lib/payment-fallback';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('test') || 'health';

    switch (testType) {
      case 'health':
        // Probar salud de ambos proveedores
        const gopagosUrl = process.env.NEXT_PUBLIC_GOPAGOS_API || '';
        const payvalidaUrl = process.env.NEXT_PUBLIC_PAYVALIDA_API || '';
        
        const [gopagosHealth, payvalidaHealth] = await Promise.all([
          checkPaymentProviderHealth(gopagosUrl),
          checkPaymentProviderHealth(payvalidaUrl)
        ]);

        return NextResponse.json({
          timestamp: new Date().toISOString(),
          providers: {
            gopagos: {
              url: gopagosUrl,
              available: gopagosHealth,
              status: gopagosHealth ? 'Disponible' : 'No disponible'
            },
            payvalida: {
              url: payvalidaUrl, 
              available: payvalidaHealth,
              status: payvalidaHealth ? ' Disponible' : 'No disponible'
            }
          },
          recommendation: gopagosHealth && payvalidaHealth 
            ? 'Ambos proveedores disponibles'
            : gopagosHealth 
              ? 'Solo GoPagos disponible'
              : payvalidaHealth
                ? 'Solo PayValida disponible'
                : 'Ningún proveedor disponible'
        });

      case 'fallback':
        // Probar sistema de fallback
        const preferredProvider = searchParams.get('preferred') as 'gopagos' | 'payvalida' || 'gopagos';
        
        const fallbackResult = await getAvailablePaymentProvider(preferredProvider);
        
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          test: 'Sistema de Fallback',
          input: {
            preferredProvider
          },
          result: {
            selectedProvider: fallbackResult.provider,
            providerUrl: fallbackResult.url,
            fallbackUsed: fallbackResult.fallbackUsed,
            status: fallbackResult.fallbackUsed 
              ? `Fallback: ${preferredProvider} → ${fallbackResult.provider}`
              : `Usando proveedor preferido: ${fallbackResult.provider}`
          }
        });

      case 'methods':
        // Probar mapeo de métodos de pago
        const paymentMethods = [
          'pse', 'nequi', '.ref', 'daviplata', 'bancolombia', 'puntored'
        ];
        
        const methodMapping = paymentMethods.map(method => ({
          method,
          requiredProvider: getRequiredProviderForMethod(method),
          description: method === 'puntored' 
            ? 'Solo GoPagos'
            : 'Cualquier proveedor (preferencia PayValida)'
        }));

        return NextResponse.json({
          timestamp: new Date().toISOString(),
          test: 'Mapeo de Métodos de Pago',
          methods: methodMapping
        });

      case 'simulate-failure':
        // Simular fallo de GoPagos
        const simulatedFallback = {
          originalProvider: 'gopagos',
          originalStatus: 'failed',
          fallbackProvider: 'payvalida',
          fallbackStatus: 'success',
          message: 'Simulación: GoPagos falló, PayValida tomó el control'
        };

        return NextResponse.json({
          timestamp: new Date().toISOString(),
          test: 'Simulación de Fallo y Fallback',
          scenario: simulatedFallback,
          userExperience: 'El usuario NO notaría el problema - pago continúa normalmente'
        });

      default:
        return NextResponse.json({
          error: 'Tipo de test no válido',
          availableTests: [
            'health - Verificar salud de proveedores',
            'fallback - Probar sistema de fallback',
            'methods - Ver mapeo de métodos de pago', 
            'simulate-failure - Simular fallo y recuperación'
          ]
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Error en test de fallback:', error);
    
    return NextResponse.json({
      error: 'Error ejecutando test de fallback',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metodoPago, simulateGoPagosDown = false } = body;

    // Simular diferentes escenarios
    if (simulateGoPagosDown) {
      // Forzar fallback
      const fallbackProvider = await getAvailablePaymentProvider('payvalida');
      
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        simulation: 'GoPagos Down',
        metodoPago,
        result: {
          provider: fallbackProvider.provider,
          fallbackUsed: true,
          message: 'Fallback automático activado',
          userExperience: 'Pago procesado normalmente con PayValida'
        }
      });
    }

    // Test normal de selección de proveedor
    const requiredProvider = getRequiredProviderForMethod(metodoPago);
    const availableProvider = await getAvailablePaymentProvider(
      requiredProvider === 'any' ? 'gopagos' : requiredProvider
    );

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metodoPago,
      requiredProvider,
      selectedProvider: availableProvider.provider,
      fallbackUsed: availableProvider.fallbackUsed,
      recommendation: availableProvider.fallbackUsed 
        ? 'Se activó el fallback automático'
        : 'Usando proveedor principal'
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Error en simulación POST',
      details: error.message
    }, { status: 500 });
  }
}