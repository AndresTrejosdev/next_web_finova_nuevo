import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { validateCreditEnvVars, getUrls } from '@/lib/env-validator';
import { apiRequest } from '@/lib/api-retry';

/**
 * Parsea una fecha de forma segura manejando múltiples formatos
 */
function parseFechaSafe(fecha: any): Date {
  if (!fecha) return new Date();
  if (fecha instanceof Date) return fecha;

  // Intentar parsear directamente (formato ISO)
  let date = new Date(fecha);
  if (!isNaN(date.getTime())) return date;

  // Si es string, intentar formato DD/MM/YYYY o DD-MM-YYYY
  if (typeof fecha === 'string') {
    const partes = fecha.split(/[/-]/);
    if (partes.length === 3) {
      // Asumir DD/MM/YYYY si el primer número es <= 31
      if (parseInt(partes[0]) <= 31) {
        date = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
        if (!isNaN(date.getTime())) return date;
      }
      // Intentar MM/DD/YYYY
      date = new Date(`${partes[2]}-${partes[0]}-${partes[1]}`);
      if (!isNaN(date.getTime())) return date;
    }
  }

  console.error('No se pudo parsear fecha:', fecha);
  return new Date(); // Fallback a fecha actual
}

export async function POST(request: NextRequest) {
  try {
    // VALIDACIÓN CRÍTICA: Variables de entorno
    validateCreditEnvVars();
    const urls = getUrls();
    
    const body = await request.json();
    const { userDocumento } = body;

    if (!userDocumento) {
      return NextResponse.json(
        { error: 'Número de documento requerido' },
        { status: 400 }
      );
    }

    // 1. Consultar créditos con reintentos automáticos
    const responseCreditos = await apiRequest.postCreditData(
      `${urls.apiUrl}/api/credit/cuotasPendiente`,
      { userDocumento }
    );

    // 2. Obtener datos del usuario con reintentos automáticos
    const responseUsuario = await apiRequest.postUserData(
      `${urls.panelUrl}/api/menu/index`,
      { userDocumento }
    );

    const creditos = responseCreditos.data;
    const datosUsuario = responseUsuario.data;

    // 3. Validar estructura y normalizar campos del backend
    const creditosValidados = (creditos || []).map((credito: any, index: number) => {
      // Validar campos críticos
      if (!credito.prestamo_ID) {
        console.warn(`Crédito ${index} sin prestamo_ID, omitiendo`);
        return null;
      }

      // Normalizar nombres de campos
      const creditoNormalizado = {
        prestamo_ID: credito.prestamo_ID,
        tipoCredito: credito.tipoCredito || credito.tipo_credito || 'CRÉDITO',
        estado: credito.estado || 'DESCONOCIDO',
        pagoMinimo: credito.pagoMinimo || credito.pago_minimo || credito.cuotaMinima || 0,
        pagoTotal: credito.pagoTotal || credito.pago_total || credito.saldoTotal || 0,
        amortizacion: credito.amortizacion || credito.cuotas || credito.pagos || [],
        documento: userDocumento,
        nombreCompleto: datosUsuario.nombre || datosUsuario.nombreCompleto || 'Cliente Finova',
        email: datosUsuario.email || datosUsuario.correo || 'cliente@finova.com.co',
        telefono: datosUsuario.telefono || datosUsuario.celular || '',
        ciudad: datosUsuario.ciudad || ''
      };

      // Validar que los montos sean números válidos
      if (isNaN(creditoNormalizado.pagoMinimo) || creditoNormalizado.pagoMinimo < 0) {
        creditoNormalizado.pagoMinimo = 0;
      }
      if (isNaN(creditoNormalizado.pagoTotal) || creditoNormalizado.pagoTotal < 0) {
        creditoNormalizado.pagoTotal = 0;
      }

      // Cálculo de mora solo de cuotas VENCIDAS, no pagadas y con mora > 0
      const fechaHoy = new Date();
      fechaHoy.setHours(0, 0, 0, 0);

      let pagoEnMoraCorregido = 0;
      if (Array.isArray(creditoNormalizado.amortizacion)) {
        creditoNormalizado.amortizacion.forEach((cuota: any, cuotaIndex: number) => {
          // Validaciones defensivas contra datos corruptos
          if (!cuota || typeof cuota !== 'object') {
            console.warn(`Cuota ${cuotaIndex} del crédito ${creditoNormalizado.prestamo_ID} es inválida`);
            return;
          }

          // Validar fecha de vencimiento
          if (!cuota.fecha) {
            console.warn(`Cuota ${cuotaIndex} del crédito ${creditoNormalizado.prestamo_ID} sin fecha`);
            return;
          }

          // USAR PARSE SEGURO DE FECHA
          const fechaVencimiento = parseFechaSafe(cuota.fecha);
          if (isNaN(fechaVencimiento.getTime())) {
            console.warn(`Cuota ${cuotaIndex} del crédito ${creditoNormalizado.prestamo_ID} tiene fecha inválida: ${cuota.fecha}`);
            return;
          }
          fechaVencimiento.setHours(0, 0, 0, 0);

          // Validar mora
          const mora = Number(cuota.mora) || 0;
          const sancion = Number(cuota.sancion) || 0;

          if (
            fechaVencimiento <= fechaHoy &&
            (cuota.estado || '').toUpperCase() !== 'PAGADA' &&
            mora > 0
          ) {
            pagoEnMoraCorregido += mora + sancion;
          }
        });
      }

      return {
        ...creditoNormalizado,
        pagoEnMora: pagoEnMoraCorregido,
        esAmortizacion: creditoNormalizado.tipoCredito?.toLowerCase().includes('amortizacion') || false,
        esExpressCredito: creditoNormalizado.tipoCredito?.toLowerCase().includes('express') || false
      };
    }).filter(Boolean); // Eliminar nulls

    // 4. Filtrar solo créditos EN CURSO y agregar metadata
    const creditosActivos = creditosValidados.filter(
      (c: any) => c.estado === 'EN CURSO'
    );

    // 5. Preparar respuesta con metadata útil para debugging
    const respuesta = {
      creditos: creditosActivos,
      metadata: {
        totalEncontrados: creditosValidados.length,
        totalEnCurso: creditosActivos.length,
        estadosEncontrados: [...new Set(creditosValidados.map((c: any) => c.estado))],
        tiposCredito: [...new Set(creditosValidados.map((c: any) => c.tipoCredito))],
        documento: userDocumento,
        consultaFecha: new Date().toISOString()
      }
    };

    // 6. Casos especiales de respuesta
    if (creditosValidados.length === 0) {
      // No se encontraron créditos en absoluto
      return NextResponse.json(
        {
          creditos: [],
          error: 'NO_CREDITS_FOUND',
          message: 'No se encontraron créditos para este documento',
          metadata: respuesta.metadata
        },
        { status: 404 }
      );
    }

    if (creditosActivos.length === 0 && creditosValidados.length > 0) {
      // Se encontraron créditos pero ninguno EN CURSO
      return NextResponse.json(
        {
          creditos: [],
          error: 'NO_ACTIVE_CREDITS',
          message: `Se encontraron ${creditosValidados.length} crédito(s) pero ninguno está EN CURSO. Estados encontrados: ${respuesta.metadata.estadosEncontrados.join(', ')}`,
          metadata: respuesta.metadata,
          creditosInactivos: creditosValidados.map((c: any) => ({
            prestamo_ID: c.prestamo_ID,
            tipoCredito: c.tipoCredito,
            estado: c.estado
          }))
        },
        { status: 200 } // 200 porque técnicamente la consulta fue exitosa
      );
    }

    // 7. Respuesta exitosa con créditos activos
    console.log(`✅ Consulta exitosa: ${creditosActivos.length} crédito(s) EN CURSO para documento ${userDocumento}`);
    return NextResponse.json(creditosActivos);

  } catch (error: any) {
    console.error('💥 Error en API de crédito después de todos los reintentos:', error.message);
    
    // Errores específicos de timeout
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      return NextResponse.json(
        { 
          error: 'Tiempo de espera agotado después de múltiples intentos',
          message: 'Los servicios están experimentando alta demanda. Intenta nuevamente en unos minutos.',
          code: 'TIMEOUT_AFTER_RETRIES',
          retryAfter: 60 // segundos
        },
        { status: 504 }
      );
    }

    // Errores de conectividad
    if (['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED'].includes(error.code)) {
      return NextResponse.json(
        {
          error: 'Error de conectividad con los servicios',
          message: 'No se pudo establecer conexión con los servidores. Verifica tu conexión e intenta nuevamente.',
          code: 'CONNECTIVITY_ERROR',
          retryAfter: 30
        },
        { status: 503 }
      );
    }

    // Errores HTTP específicos
    if (error.response?.status >= 500) {
      return NextResponse.json(
        {
          error: 'Error interno del servidor',
          message: 'Los servicios están experimentando problemas técnicos. Intenta nuevamente más tarde.',
          code: 'SERVER_ERROR',
          status: error.response.status,
          retryAfter: 120
        },
        { status: error.response.status }
      );
    }

    // Error genérico
    return NextResponse.json(
      { 
        error: 'Error al consultar los créditos',
        message: 'Ocurrió un error inesperado. Si el problema persiste, contacta soporte.',
        details: error.response?.data || error.message,
        code: 'GENERIC_ERROR'
      },
      { status: error.response?.status || 500 }
    );
  }
}