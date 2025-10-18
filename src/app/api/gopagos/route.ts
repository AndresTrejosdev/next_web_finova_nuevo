import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { validateEnvironment, sanitizeAmount, validateEmail } from '@/lib/validators';
import { validateGoPageEnvVars, getUrls } from '@/lib/env-validator';
import { apiRequest } from '@/lib/api-retry';
import { 
  getAvailablePaymentProvider, 
  getRequiredProviderForMethod,
  normalizePaymentResponse,
  adaptPayloadForProvider
} from '@/lib/payment-fallback';

export async function POST(request: NextRequest) {
  try {
    // 🚨 VALIDACIÓN CRÍTICA: Variables de entorno
    validateEnvironment();
    validateGoPageEnvVars();
    const urls = getUrls();
    
    const body = await request.json();
    const {
      nombreCliente,
      email,
      amount,
      identification,
      identificationType = 'CC',
      metodoPago = 'puntored',
      ordenId,
      prestamoId
    } = body;

    // Validaciones mejoradas
    const sanitizedAmount = sanitizeAmount(amount);
    
    if (sanitizedAmount < 1000) {
      return NextResponse.json(
        { error: 'Monto mínimo de $1,000' },
        { status: 400 }
      );
    }

    if (!identification || !email || !nombreCliente) {
      return NextResponse.json(
        { error: 'Datos incompletos: se requiere nombre, email y cédula' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (!ordenId) {
      return NextResponse.json(
        { error: 'ordenId es requerido' },
        { status: 400 }
      );
    }

    // SISTEMA DE FALLBACK: Determinar proveedor disponible
    const requiredProvider = getRequiredProviderForMethod(metodoPago);
    
    // PuntoRed requiere específicamente GoPagos
    let preferredProvider: 'gopagos' | 'payvalida' = 'gopagos';
    if (requiredProvider === 'payvalida') {
      preferredProvider = 'payvalida';
    }

    const providerInfo = await getAvailablePaymentProvider(preferredProvider);

    console.log(`Procesando pago con ${providerInfo.provider}${providerInfo.fallbackUsed ? ' (FALLBACK)' : ''}`);
    console.log('Datos del pago:', {
      nombreCliente,
      email,
      amount,
      identification,
      ordenId,
      metodoPago,
      provider: providerInfo.provider
    });

    // FALLBACK CRÍTICO: Si GoPagos no está disponible
    if (providerInfo.fallbackUsed && providerInfo.provider === 'payvalida') {
      console.warn('FALLBACK ACTIVADO: GoPagos no disponible, redirigiendo a PayValida');
      
      // Adaptar payload para PayValida
      const payvalidaPayload = adaptPayloadForProvider(body, 'payvalida');
      
      // Crear nueva request para PayValida
      const payvalidaUrl = new URL('/api/payvalida', request.url);
      const payvalidaRequest = new Request(payvalidaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payvalidaPayload)
      });

      try {
        // Importar dinámicamente el handler de PayValida
        const { POST: payvalidaHandler } = await import('../payvalida/route');
        const fallbackResponse = await payvalidaHandler(payvalidaRequest as NextRequest);
        
        // Agregar metadata de fallback a la respuesta
        const responseData = await fallbackResponse.json();
        
        return NextResponse.json({
          ...responseData,
          provider: 'payvalida',
          fallbackUsed: true,
          originalProvider: 'gopagos',
          message: 'Pago procesado con PayValida (fallback automático)'
        }, { status: fallbackResponse.status });
        
      } catch (fallbackError: any) {
        console.error('Error en fallback a PayValida:', fallbackError);
        
        return NextResponse.json({
          error: 'Error al procesar el pago',
          details: 'Tanto GoPagos como PayValida están experimentando problemas',
          fallbackAttempted: true,
          originalError: 'GoPagos no disponible',
          fallbackError: fallbackError.message
        }, { status: 503 });
      }
    }

    // Continuar con GoPagos si está disponible
    try {
      // Llamar a GoPagos con reintentos automáticos
      const response = await apiRequest.postPaymentData(
        `${urls.gopagosApi}/generarLink`,
        {
          nombreCliente,
          email,
          amount: sanitizedAmount,
          identification,
          identificationType,
          metodoPago,
          ordenId,
          returnUrl: urls.returnUrl,
          cancelUrl: urls.cancelUrl
        }
      );

      console.log('Respuesta de GoPagos:', response.data);

      // Construir URL completa
      const link = response.data;
      const urlCompleta = typeof link === 'string' 
        ? (link.startsWith('http') ? link : `https://${link}`)
        : link.url || link.paymentUrl || '';

      if (!urlCompleta) {
        throw new Error('GoPagos no retornó una URL válida');
      }

      return NextResponse.json({ 
        url: urlCompleta,
        ordenId,
        status: 'success',
        provider: 'gopagos',
        fallbackUsed: false
      });

    } catch (gopagosError: any) {
      console.error('Error con GoPagos, intentando fallback:', gopagosError.message);
      
      // Si GoPagos falla, intentar fallback a PayValida
      if (metodoPago !== 'puntored') { // PuntoRed solo funciona con GoPagos
        console.log('Intentando fallback automático a PayValida...');
        
        try {
          const payvalidaPayload = adaptPayloadForProvider(body, 'payvalida');
          const payvalidaUrl = new URL('/api/payvalida', request.url);
          const payvalidaRequest = new Request(payvalidaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payvalidaPayload)
          });

          const { POST: payvalidaHandler } = await import('../payvalida/route');
          const fallbackResponse = await payvalidaHandler(payvalidaRequest as NextRequest);
          const responseData = await fallbackResponse.json();
          
          return NextResponse.json({
            ...responseData,
            provider: 'payvalida',
            fallbackUsed: true,
            originalProvider: 'gopagos',
            message: 'Pago procesado con PayValida (fallback por error en GoPagos)'
          }, { status: fallbackResponse.status });
          
        } catch (fallbackError: any) {
          console.error('Fallback también falló:', fallbackError);
          
          return NextResponse.json({
            error: 'Error al procesar el pago',
            details: 'Problemas con ambos proveedores de pago',
            gopagosError: gopagosError.message,
            payvalidaError: fallbackError.message,
            suggestion: 'Por favor intente nuevamente en unos minutos'
          }, { status: 503 });
        }
      }
      
      // Para PuntoRed que solo funciona con GoPagos
      return NextResponse.json({
        error: 'Error al procesar el pago con PuntoRed',
        details: gopagosError.response?.data || gopagosError.message,
        suggestion: 'PuntoRed requiere GoPagos. Intente con otro método de pago.'
      }, { status: gopagosError.response?.status || 500 });
    }

  } catch (error: any) {
    console.error('Error general en endpoint GoPagos:', error.message);
    
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Webhook para GoPagos
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Webhook GoPagos recibido:', body);

    // Procesar notificación de GoPagos
    const { ordenId, estado, transactionId, amount } = body;

    // Aquí actualizarías el estado del pago en tu base de datos
    // await actualizarEstadoPago({ ordenId, estado, transactionId, provider: 'gopagos' });

    return NextResponse.json({ 
      status: 'received',
      message: 'Webhook GoPagos procesado correctamente'
    });

  } catch (error: any) {
    console.error('Error procesando webhook GoPagos:', error);
    
    return NextResponse.json(
      { error: 'Error procesando webhook GoPagos' },
      { status: 500 }
    );
  }
}