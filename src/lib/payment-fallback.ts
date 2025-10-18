/**
 * SISTEMA DE FALLBACK PARA APIs DE PAGO
 * 
 * Maneja casos donde APIs de pago no están disponibles
 * Implementa fallbacks inteligentes entre proveedores
 */

import { axiosWithRetry } from './api-retry';

export interface PaymentProvider {
  name: string;
  url: string;
  available: boolean;
  lastChecked?: Date;
  fallbackTo?: string;
}

/**
 * Verifica si una API de pago está disponible
 */
export async function checkPaymentProviderHealth(url: string): Promise<boolean> {
  if (!url || url.trim() === '') {
    return false;
  }

  // URLs de desarrollo/placeholder que sabemos que no existen
  const developmentUrls = [
    'https://gopagos.finova.com.co',
    'https://example.com',
    'https://localhost',
    'http://localhost'
  ];

  if (developmentUrls.some(devUrl => url.includes(devUrl))) {
    console.warn(`URL de desarrollo detectada: ${url}`);
    return false;
  }

  try {
    // Intentar hacer una petición de health check
    const response = await axiosWithRetry(
      { 
        method: 'GET', 
        url: `${url}/health`,
        timeout: 5000 
      },
      { 
        retries: 1, 
        retryDelay: 500,
        exponentialBackoff: false
      }
    );

    return response.status >= 200 && response.status < 300;
  } catch (error: any) {
    console.warn(`API ${url} no disponible:`, error.message);
    return false;
  }
}

/**
 * Obtiene el proveedor de pago disponible con fallback
 */
export async function getAvailablePaymentProvider(
  preferredProvider: 'gopagos' | 'payvalida' = 'gopagos'
): Promise<{
  provider: 'gopagos' | 'payvalida';
  url: string;
  fallbackUsed: boolean;
}> {
  const gopagosUrl = process.env.NEXT_PUBLIC_GOPAGOS_API || '';
  const payvalidaUrl = process.env.NEXT_PUBLIC_PAYVALIDA_API || '';

  // Verificar proveedor preferido primero
  if (preferredProvider === 'gopagos') {
    const gopagosAvailable = await checkPaymentProviderHealth(gopagosUrl);
    
    if (gopagosAvailable) {
      return {
        provider: 'gopagos',
        url: gopagosUrl,
        fallbackUsed: false
      };
    }

    // Fallback a PayValida
    console.warn('GoPagos no disponible, usando PayValida como fallback');
    return {
      provider: 'payvalida',
      url: payvalidaUrl,
      fallbackUsed: true
    };
  } else {
    // PayValida como preferido
    const payvalidaAvailable = await checkPaymentProviderHealth(payvalidaUrl);
    
    if (payvalidaAvailable) {
      return {
        provider: 'payvalida',
        url: payvalidaUrl,
        fallbackUsed: false
      };
    }

    // Fallback a GoPagos
    console.warn('PayValida no disponible, usando GoPagos como fallback');
    return {
      provider: 'gopagos',
      url: gopagosUrl,
      fallbackUsed: true
    };
  }
}

/**
 * Detecta si un método de pago requiere un proveedor específico
 */
export function getRequiredProviderForMethod(metodoPago: string): 'gopagos' | 'payvalida' | 'any' {
  const methodProviderMap: Record<string, 'gopagos' | 'payvalida'> = {
    'puntored': 'gopagos',
    // Otros métodos pueden usar cualquier proveedor
    'pse': 'payvalida',
    'nequi': 'payvalida',
    '.ref': 'payvalida',
    'daviplata': 'payvalida',
    'bancolombia': 'payvalida'
  };

  return methodProviderMap[metodoPago] || 'payvalida';
}

/**
 * Normaliza la respuesta entre diferentes proveedores
 */
export function normalizePaymentResponse(
  response: any, 
  provider: 'gopagos' | 'payvalida',
  ordenId: string
) {
  // Construir URL completa
  const rawUrl = response.data || response;
  let urlCompleta = '';

  if (typeof rawUrl === 'string') {
    urlCompleta = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  } else if (rawUrl.url) {
    urlCompleta = rawUrl.url;
  } else if (rawUrl.paymentUrl) {
    urlCompleta = rawUrl.paymentUrl;
  } else if (rawUrl.link) {
    urlCompleta = rawUrl.link;
  }

  if (!urlCompleta) {
    throw new Error(`${provider === 'gopagos' ? 'GoPagos' : 'PayValida'} no retornó una URL válida`);
  }

  return {
    url: urlCompleta,
    ordenId,
    status: 'success',
    provider,
    timestamp: new Date().toISOString()
  };
}

/**
 * Adapta el payload según el proveedor
 */
export function adaptPayloadForProvider(
  payload: any,
  provider: 'gopagos' | 'payvalida'
) {
  if (provider === 'gopagos') {
    return {
      ...payload,
      // Campos específicos de GoPagos
      returnUrl: payload.returnUrl || process.env.NEXT_PUBLIC_RETURN_URL,
      cancelUrl: payload.cancelUrl || process.env.NEXT_PUBLIC_CANCEL_URL
    };
  } else {
    // PayValida
    return {
      nombreCliente: payload.nombreCliente,
      email: payload.email,
      amount: payload.amount,
      identification: payload.identification,
      identificationType: payload.identificationType || 'CC',
      metodoPago: payload.metodoPago || 'pse',
      ordenId: payload.ordenId
    };
  }
}