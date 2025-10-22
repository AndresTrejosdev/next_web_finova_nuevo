/**
 * UTILIDADES API FINOVA
 * Centraliza todas las llamadas a los endpoints externos
 * Incluye manejo de errores robusto y logging
 */

// URLs base desde variables de entorno
const API_URLS = {
  payvalida: process.env.NEXT_PUBLIC_PAYVALIDA_API,
  panel: process.env.NEXT_PUBLIC_PANEL_URL,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
};

// Configuración base para fetch
const defaultFetchConfig = {
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 segundos timeout
};

// Helper para manejar respuestas de fetch
const handleResponse = async (response, endpoint) => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Si no se puede parsear como JSON, usar el mensaje por defecto
      }
    }
    
    throw new Error(`${endpoint} - ${errorMessage}`);
  }

  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
};

// Helper para logging de requests
const logRequest = (endpoint, data) => {
  console.log(`[API] Llamando a ${endpoint}:`, {
    timestamp: new Date().toISOString(),
    data: process.env.NODE_ENV === 'development' ? data : '[HIDDEN]'
  });
};

export const apiFinova = {
  /**
   * 1. GENERAR LINK DE PAGO (PAYVALIDA)
   * Genera un link de pago usando la pasarela PayValida
   */
  generarLinkPago: async (datos) => {
    const endpoint = 'PayValida/generarLink';
    
    try {
      logRequest(endpoint, datos);
      
      const payload = {
        nombreCliente: datos.nombreCliente,
        email: datos.email,
        amount: datos.amount,
        identification: datos.identification,
        identificationType: datos.identificationType || "CC",
        metodoPago: datos.metodoPago, // "efecty", "PSE", "nequi", etc.
        ordenId: datos.ordenId
      };

      const response = await fetch(`${API_URLS.payvalida}/generarLink`, {
        method: 'POST',
        ...defaultFetchConfig,
        body: JSON.stringify(payload)
      });
      
      const result = await handleResponse(response, endpoint);
      
      console.log(`[API] ${endpoint} exitoso:`, {
        ordenId: datos.ordenId,
        hasLink: !!result.paymentLink || !!result.link
      });
      
      return result;
      
    } catch (error) {
      console.error(`[API] Error en ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * 2. OBTENER MENÚ DE USUARIO (PANEL)
   * Obtiene información del usuario y menú de opciones
   */
  obtenerMenu: async (documento) => {
    const endpoint = 'Panel/obtenerMenu';
    
    try {
      logRequest(endpoint, { userDocumento: documento });
      
      const response = await fetch(`${API_URLS.panel}/api/menu/index`, {
        method: 'POST',
        ...defaultFetchConfig,
        body: JSON.stringify({ userDocumento: documento })
      });
      
      const result = await handleResponse(response, endpoint);
      
      console.log(`[API] ${endpoint} exitoso:`, {
        documento,
        hasData: !!result,
        userName: result?.nombre || result?.nombreCompleto || '[NO_NAME]'
      });
      
      return result;
      
    } catch (error) {
      console.error(`[API] Error en ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * 3. CONSULTAR CUOTAS PENDIENTES (PANEL)
   * Obtiene las cuotas pendientes de pago de un usuario
   */
  consultarCuotas: async (documento) => {
    const endpoint = 'Panel/consultarCuotas';
    
    try {
      logRequest(endpoint, { userDocumento: documento });
      
      const response = await fetch(`${API_URLS.panel}/api/credit/cuotasPendiente`, {
        method: 'POST',
        ...defaultFetchConfig,
        body: JSON.stringify({ userDocumento: documento })
      });
      
      const result = await handleResponse(response, endpoint);
      
      console.log(`[API] ${endpoint} exitoso:`, {
        documento,
        cuotasCount: Array.isArray(result) ? result.length : 0,
        hasData: !!result
      });
      
      return result;
      
    } catch (error) {
      console.error(`[API] Error en ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * 4. CONSULTAR CRÉDITOS EN CURSO (API LOCAL)
   * Usa el endpoint local /api/credito que ya tienes implementado
   */
  consultarCreditos: async (documento) => {
    const endpoint = 'Local/consultarCreditos';
    
    try {
      logRequest(endpoint, { userDocumento: documento });
      
      const response = await fetch('/api/credito', {
        method: 'POST',
        ...defaultFetchConfig,
        body: JSON.stringify({ userDocumento: documento })
      });
      
      const result = await handleResponse(response, endpoint);
      
      console.log(`[API] ${endpoint} exitoso:`, {
        documento,
        creditosCount: Array.isArray(result) ? result.length : 0
      });
      
      return result;
      
    } catch (error) {
      console.error(`[API] Error en ${endpoint}:`, error);
      throw error;
    }
  }
};

/**
 * EJEMPLOS DE USO:
 * 
 * // Generar link de pago
 * const linkPago = await apiFinova.generarLinkPago({
 *   nombreCliente: "Andrés Trejos",
 *   email: "andres@example.com",
 *   amount: 25000,
 *   identification: "1088324927",
 *   metodoPago: "PSE",
 *   ordenId: "ORD_" + Date.now()
 * });
 * 
 * // Obtener menú de usuario
 * const menu = await apiFinova.obtenerMenu(1088324927);
 * 
 * // Consultar cuotas pendientes
 * const cuotas = await apiFinova.consultarCuotas(1088324927);
 * 
 * // Consultar créditos en curso
 * const creditos = await apiFinova.consultarCreditos(1088324927);
 */