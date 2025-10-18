/**
 * ⚠️ VALIDACIONES CRÍTICAS DE VARIABLES DE ENTORNO
 * 
 * Este módulo previene errores 500 por variables faltantes
 * Debe ejecutarse al inicio de cada route.ts
 */

interface RequiredEnvVars {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_PANEL_URL: string;
  NEXT_PUBLIC_PAYVALIDA_API: string;
  NEXT_PUBLIC_GOPAGOS_API: string;
  NEXT_PUBLIC_RETURN_URL: string;
  NEXT_PUBLIC_CANCEL_URL: string;
}

/**
 * Valida todas las variables de entorno críticas
 * @throws Error si alguna variable falta o está vacía
 */
export function validateCriticalEnvVars(): RequiredEnvVars {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_PANEL_URL', 
    'NEXT_PUBLIC_PAYVALIDA_API',
    'NEXT_PUBLIC_GOPAGOS_API',
    'NEXT_PUBLIC_RETURN_URL',
    'NEXT_PUBLIC_CANCEL_URL'
  ] as const;

  const missingVars: string[] = [];
  const envVars: Partial<RequiredEnvVars> = {};

  for (const varName of requiredVars) {
    const value = process.env[varName];
    
    if (!value || value.trim() === '') {
      missingVars.push(varName);
    } else {
      envVars[varName] = value.trim();
    }
  }

  if (missingVars.length > 0) {
    const error = new Error(
      `❌ VARIABLES DE ENTORNO CRÍTICAS FALTANTES: ${missingVars.join(', ')}\n` +
      `Configura estas variables en .env.local para evitar errores 500`
    );
    
    console.error('🚨 ERROR CRÍTICO DE CONFIGURACIÓN:', error.message);
    throw error;
  }

  console.log('✅ Variables de entorno validadas correctamente');
  return envVars as RequiredEnvVars;
}

/**
 * Valida variables específicas para PayValida
 */
export function validatePayValidaEnvVars() {
  if (!process.env.NEXT_PUBLIC_PAYVALIDA_API) {
    throw new Error('NEXT_PUBLIC_PAYVALIDA_API no está configurada');
  }
  
  if (!process.env.NEXT_PUBLIC_RETURN_URL) {
    throw new Error('NEXT_PUBLIC_RETURN_URL no está configurada');
  }
  
  if (!process.env.NEXT_PUBLIC_CANCEL_URL) {
    throw new Error('NEXT_PUBLIC_CANCEL_URL no está configurada');
  }
}

/**
 * Valida variables específicas para GoPagos
 */
export function validateGoPageEnvVars() {
  if (!process.env.NEXT_PUBLIC_GOPAGOS_API) {
    throw new Error('NEXT_PUBLIC_GOPAGOS_API no está configurada');
  }
  
  if (!process.env.NEXT_PUBLIC_RETURN_URL) {
    throw new Error('NEXT_PUBLIC_RETURN_URL no está configurada');
  }
}

/**
 * Valida variables específicas para consulta de créditos
 */
export function validateCreditEnvVars() {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL no está configurada');
  }
  
  if (!process.env.NEXT_PUBLIC_PANEL_URL) {
    throw new Error('NEXT_PUBLIC_PANEL_URL no está configurada');
  }
}

/**
 * Obtiene la URL base configurada de forma segura
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://finova.com.co';
}

/**
 * Obtiene todas las URLs de forma segura
 */
export function getUrls() {
  const envs = validateCriticalEnvVars();
  
  return {
    apiUrl: envs.NEXT_PUBLIC_API_URL,
    panelUrl: envs.NEXT_PUBLIC_PANEL_URL,
    payvalidaApi: envs.NEXT_PUBLIC_PAYVALIDA_API,
    gopagosApi: envs.NEXT_PUBLIC_GOPAGOS_API,
    returnUrl: envs.NEXT_PUBLIC_RETURN_URL,
    cancelUrl: envs.NEXT_PUBLIC_CANCEL_URL,
    baseUrl: getBaseUrl()
  };
}