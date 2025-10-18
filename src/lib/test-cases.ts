/**
 * CASOS DE PRUEBA PARA MANEJO DE CRÉDITOS
 * 
 * Este archivo documenta los diferentes casos que maneja el sistema
 * y cómo probar cada uno de ellos
 */

export interface CasoPrueba {
  id: string;
  descripcion: string;
  simulacion: string;
  respuestaEsperada: any;
  codigoRespuesta: number;
}

export const CASOS_PRUEBA_CREDITOS: CasoPrueba[] = [
  {
    id: 'CREDITOS_ACTIVOS_NORMAL',
    descripcion: 'Usuario con créditos EN CURSO (caso normal)',
    simulacion: 'Documento con créditos estado = "EN CURSO"',
    respuestaEsperada: {
      tipo: 'array',
      contenido: 'Lista de créditos con estado EN CURSO'
    },
    codigoRespuesta: 200
  },
  
  {
    id: 'SIN_CREDITOS_ABSOLUTO',
    descripcion: 'Usuario sin créditos en absoluto',
    simulacion: 'Documento que no existe en el sistema',
    respuestaEsperada: {
      creditos: [],
      error: 'NO_CREDITS_FOUND',
      message: 'No se encontraron créditos para este documento',
      metadata: {
        totalEncontrados: 0,
        totalEnCurso: 0,
        estadosEncontrados: [],
        tiposCredito: []
      }
    },
    codigoRespuesta: 404
  },
  
  {
    id: 'CREDITOS_INACTIVOS',
    descripcion: 'Usuario con créditos pero ninguno EN CURSO',
    simulacion: 'Documento con créditos estado = "FINALIZADO", "CANCELADO", etc.',
    respuestaEsperada: {
      creditos: [],
      error: 'NO_ACTIVE_CREDITS',
      message: 'Se encontraron X crédito(s) pero ninguno está EN CURSO. Estados encontrados: FINALIZADO, CANCELADO',
      metadata: {
        totalEncontrados: 2,
        totalEnCurso: 0,
        estadosEncontrados: ['FINALIZADO', 'CANCELADO'],
        tiposCredito: ['CRÉDITO EXPRESS', 'AMORTIZACIÓN']
      },
      creditosInactivos: [
        { prestamo_ID: 12345, tipoCredito: 'CRÉDITO EXPRESS', estado: 'FINALIZADO' },
        { prestamo_ID: 67890, tipoCredito: 'AMORTIZACIÓN', estado: 'CANCELADO' }
      ]
    },
    codigoRespuesta: 200
  },
  
  {
    id: 'CREDITOS_MIXTOS',
    descripcion: 'Usuario con créditos EN CURSO y otros estados',
    simulacion: 'Documento con créditos mixtos (algunos EN CURSO, otros no)',
    respuestaEsperada: {
      tipo: 'array',
      contenido: 'Solo los créditos EN CURSO, filtrados automáticamente'
    },
    codigoRespuesta: 200
  },
  
  {
    id: 'ERROR_TIMEOUT',
    descripcion: 'Timeout de API después de reintentos',
    simulacion: 'API externa no responde después de 3 reintentos',
    respuestaEsperada: {
      error: 'Tiempo de espera agotado después de múltiples intentos',
      message: 'Los servicios están experimentando alta demanda. Intenta nuevamente en unos minutos.',
      code: 'TIMEOUT_AFTER_RETRIES',
      retryAfter: 60
    },
    codigoRespuesta: 504
  },
  
  {
    id: 'ERROR_CONECTIVIDAD',
    descripcion: 'Error de red o DNS',
    simulacion: 'APIs externas no disponibles (ECONNREFUSED, ENOTFOUND)',
    respuestaEsperada: {
      error: 'Error de conectividad con los servicios',
      message: 'No se pudo establecer conexión con los servidores. Verifica tu conexión e intenta nuevamente.',
      code: 'CONNECTIVITY_ERROR',
      retryAfter: 30
    },
    codigoRespuesta: 503
  }
];

/**
 * Mensajes que el usuario ve en el frontend según cada caso
 */
export const MENSAJES_USUARIO = {
  NO_CREDITS_FOUND: 'No se encontraron créditos para este documento. Verifica que el número de cédula sea correcto.',
  
  NO_ACTIVE_CREDITS: `Se encontraron créditos pero ninguno está EN CURSO.

Créditos encontrados (inactivos):
• Préstamo #12345 - CRÉDITO EXPRESS (FINALIZADO)
• Préstamo #67890 - AMORTIZACIÓN (CANCELADO)

Para más información sobre estos créditos, contacta a soporte.`,
  
  TIMEOUT_AFTER_RETRIES: 'Tiempo de espera agotado. Los servicios están experimentando alta demanda. Intenta nuevamente en unos minutos.',
  
  CONNECTIVITY_ERROR: 'Error de conectividad. Verifica tu conexión a internet e intenta nuevamente.',
  
  GENERIC_ERROR: 'Error al consultar los créditos'
};

/**
 * Cómo probar cada caso en desarrollo
 */
export const GUIA_PRUEBAS = {
  1: {
    titulo: 'Probar caso SIN_CREDITOS_ABSOLUTO',
    pasos: [
      'Usar una cédula que no exista en el sistema (ej: 00000000)',
      'Verificar que la API retorna 404',
      'Verificar que el frontend muestra: "No se encontraron créditos para este documento"'
    ]
  },
  
  2: {
    titulo: 'Probar caso NO_ACTIVE_CREDITS', 
    pasos: [
      'Usar una cédula con créditos FINALIZADOS o CANCELADOS',
      'Verificar que la API retorna 200 con error NO_ACTIVE_CREDITS',
      'Verificar que el frontend muestra lista de créditos inactivos'
    ]
  },
  
  3: {
    titulo: 'Probar timeout (simulado)',
    pasos: [
      'Cambiar temporalmente el timeout de API a 1ms',
      'Hacer una consulta',
      'Verificar mensaje de timeout después de reintentos'
    ]
  },
  
  4: {
    titulo: 'Probar conectividad (simulado)',
    pasos: [
      'Cambiar temporalmente la URL de API a una inválida',
      'Hacer una consulta', 
      'Verificar mensaje de error de conectividad'
    ]
  }
};