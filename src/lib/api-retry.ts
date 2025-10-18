/**
 * SISTEMA DE REINTENTOS PARA APIs EXTERNAS
 * 
 * Maneja timeouts y reintentos automáticos con backoff exponencial
 * Previene errores 504 Gateway Timeout
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface RetryConfig {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  exponentialBackoff?: boolean;
}

/**
 * Realiza una petición HTTP con sistema de reintentos
 */
export async function axiosWithRetry<T = any>(
  config: AxiosRequestConfig,
  retryConfig: RetryConfig = {}
): Promise<AxiosResponse<T>> {
  const {
    retries = 2,
    retryDelay = 1000,
    timeout = 15000,
    exponentialBackoff = true
  } = retryConfig;

  // Configurar timeout por defecto
  const axiosConfig: AxiosRequestConfig = {
    ...config,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    }
  };

  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Intento ${attempt + 1}/${retries + 1} para ${config.method?.toUpperCase()} ${config.url}`);
      
      const startTime = Date.now();
      const response = await axios(axiosConfig);
      const duration = Date.now() - startTime;
      
      console.log(`Petición exitosa en ${duration}ms: ${config.method?.toUpperCase()} ${config.url}`);
      return response;
      
    } catch (error: any) {
      lastError = error;
      
      // Determinar si el error es reintentar
      const shouldRetry = shouldRetryRequest(error, attempt, retries);
      
      if (!shouldRetry) {
        console.error(`Error no recuperable en ${config.method?.toUpperCase()} ${config.url}:`, error.message);
        throw error;
      }
      
      if (attempt < retries) {
        const delay = exponentialBackoff 
          ? retryDelay * Math.pow(2, attempt)
          : retryDelay;
          
        console.warn(
          `Intento ${attempt + 1} falló para ${config.method?.toUpperCase()} ${config.url}. ` +
          `Reintentando en ${delay}ms... Error: ${error.message}`
        );
        
        await sleep(delay);
      }
    }
  }

  console.error(`Todos los intentos fallaron para ${config.method?.toUpperCase()} ${config.url}`);
  throw lastError;
}

/**
 * Determina si un error debe causar un reintento
 */
function shouldRetryRequest(error: any, attempt: number, maxRetries: number): boolean {
  // No reintentar si ya agotamos los intentos
  if (attempt >= maxRetries) {
    return false;
  }

  // Errores que SÍ deben reintentar
  const retryableErrors = [
    'ECONNABORTED', // Timeout
    'ECONNRESET',   // Conexión reseteada  
    'ENOTFOUND',    // DNS no encontrado
    'ECONNREFUSED', // Conexión rechazada
    'ETIMEDOUT',    // Timeout de conexión
    'EAI_AGAIN'     // DNS temporal
  ];

  // Códigos de estado HTTP que deben reintentar
  const retryableStatusCodes = [
    408, // Request Timeout
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
    507, // Insufficient Storage
    508, // Loop Detected
    510, // Not Extended
    511  // Network Authentication Required
  ];

  // Verificar código de error
  if (error.code && retryableErrors.includes(error.code)) {
    return true;
  }

  // Verificar código de estado HTTP
  if (error.response?.status && retryableStatusCodes.includes(error.response.status)) {
    return true;
  }

  // Verificar mensaje de error para timeouts
  if (error.message?.toLowerCase().includes('timeout')) {
    return true;
  }

  // No reintentar para otros errores
  return false;
}

/**
 * Pausa la ejecución por el tiempo especificado
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Configuraciones predefinidas para diferentes tipos de APIs
 */
export const API_CONFIGS = {
  // APIs críticas que requieren mayor timeout
  CREDIT_API: {
    retries: 3,
    retryDelay: 1500,
    timeout: 20000,
    exponentialBackoff: true
  },
  
  // APIs de usuario (menos críticas)
  USER_API: {
    retries: 2,
    retryDelay: 1000,
    timeout: 15000,
    exponentialBackoff: true
  },
  
  // APIs de pago (críticas pero más rápidas)
  PAYMENT_API: {
    retries: 3,
    retryDelay: 800,
    timeout: 25000,
    exponentialBackoff: true
  },
  
  // APIs de notificación (menos críticas)
  NOTIFICATION_API: {
    retries: 1,
    retryDelay: 500,
    timeout: 10000,
    exponentialBackoff: false
  }
};

/**
 * Funciones de conveniencia para tipos específicos de peticiones
 */
export const apiRequest = {
  /**
   * GET con reintentos para consulta de créditos
   */
  getCreditData: async (url: string, params?: any) => {
    return axiosWithRetry({
      method: 'GET',
      url,
      params
    }, API_CONFIGS.CREDIT_API);
  },

  /**
   * POST con reintentos para consulta de créditos
   */
  postCreditData: async (url: string, data: any) => {
    return axiosWithRetry({
      method: 'POST',
      url,
      data
    }, API_CONFIGS.CREDIT_API);
  },

  /**
   * POST con reintentos para datos de usuario
   */
  postUserData: async (url: string, data: any) => {
    return axiosWithRetry({
      method: 'POST',
      url,
      data
    }, API_CONFIGS.USER_API);
  },

  /**
   * POST con reintentos para pagos
   */
  postPaymentData: async (url: string, data: any) => {
    return axiosWithRetry({
      method: 'POST',
      url,
      data
    }, API_CONFIGS.PAYMENT_API);
  }
};