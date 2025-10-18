import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { validateCreditEnvVars, getUrls } from '@/lib/env-validator';
import { validateEnvironment, parseFechaSafe, sanitizeAmount, validateEmail } from '@/lib/validators';

/**
 * Parsea una fecha de forma segura manejando múltiples formatos
 * Función local mejorada basada en el validador centralizado
 */
function parseFechaSafeLocal(fecha: any): Date {
  if (!fecha) return new Date();
  if (fecha instanceof Date) return fecha;

  let date = new Date(fecha);
  if (!isNaN(date.getTime())) return date;

  if (typeof fecha === 'string') {
    const partes = fecha.split(/[/-]/);
    if (partes.length === 3) {
      if (parseInt(partes[0]) <= 31) {
        date = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
        if (!isNaN(date.getTime())) return date;
      }
      date = new Date(`${partes[2]}-${partes[0]}-${partes[1]}`);
      if (!isNaN(date.getTime())) return date;
    }
  }

  console.error('⚠️ No se pudo parsear fecha:', fecha);
  return new Date();
}

// Axios config y helper con retry
const axiosConfig = {
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 segundos
};

// Función para retry en axios
async function axiosWithRetry(config: any, maxRetries = 2) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await axios(config);
    } catch (error: any) {
      if (i === maxRetries) throw error;
      if (error.code === 'ECONNABORTED' || error.response?.status >= 500) {
        console.log(`⚠️ Retry ${i + 1}/${maxRetries} después de error`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      } else {
        throw error; // No reintentar errores 4xx
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // VALIDACIÓN CRÍTICA: Variables de entorno
    validateEnvironment();
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

    // 1. Consultar créditos (con retry)
    const responseCreditos = await axiosWithRetry({
      method: 'post',
      url: `${urls.apiUrl}/api/credit/cuotasPendiente`,
      data: { userDocumento },
      ...axiosConfig
    });

    // 2. Obtener datos del usuario (con retry)
    const responseUsuario = await axiosWithRetry({
      method: 'post',
      url: `${urls.panelUrl}/api/menu/index`,
      data: { userDocumento },
      ...axiosConfig
    });

    const creditos = responseCreditos.data;
    const datosUsuario = responseUsuario.data;

    // 3. Validar estructura y normalizar campos del backend
    const creditosValidados = (creditos || []).map((credito: any, index: number) => {
      // Validar campos críticos
      if (!credito.prestamo_ID) {
        console.warn(`⚠️ Crédito ${index} sin prestamo_ID, omitiendo`);
        return null;
      }

      // Normalizar nombres de campos
      const creditoNormalizado = {
        prestamo_ID: credito.prestamo_ID,
        // MEJORA #8: Proteger contra tipoCredito null/undefined
        tipoCredito: credito.tipoCredito || credito.tipo_credito || 'CRÉDITO',
        estado: credito.estado || 'DESCONOCIDO',
        pagoMinimo: sanitizeAmount(credito.pagoMinimo || credito.pago_minimo || credito.cuotaMinima || 0),
        pagoTotal: sanitizeAmount(credito.pagoTotal || credito.pago_total || credito.saldoTotal || 0),
        amortizacion: credito.amortizacion || credito.cuotas || credito.pagos || [],
        documento: userDocumento,
        // MEJORA #9: Intentar campos alternativos para nombre y email
        nombreCompleto: datosUsuario.nombre || datosUsuario.nombreCompleto || datosUsuario.nombre_completo || 'Cliente Finova',
        email: validateEmail(datosUsuario.email || datosUsuario.correo || datosUsuario.mail || '') ? 
               (datosUsuario.email || datosUsuario.correo || datosUsuario.mail) : 'cliente@finova.com.co',
        telefono: datosUsuario.telefono || datosUsuario.celular || datosUsuario.phone || '',
        ciudad: datosUsuario.ciudad || datosUsuario.city || ''
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
            console.warn(`⚠️ Cuota ${cuotaIndex} del crédito ${creditoNormalizado.prestamo_ID} es inválida`);
            return;
          }

          // Validar fecha de vencimiento
          if (!cuota.fecha) {
            console.warn(`⚠️ Cuota ${cuotaIndex} del crédito ${creditoNormalizado.prestamo_ID} sin fecha`);
            return;
          }

          // USAR PARSE SEGURO DE FECHA
          const fechaVencimiento = parseFechaSafeLocal(cuota.fecha);
          if (isNaN(fechaVencimiento.getTime())) {
            console.warn(`⚠️ Cuota ${cuotaIndex} del crédito ${creditoNormalizado.prestamo_ID} tiene fecha inválida: ${cuota.fecha}`);
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
        // MEJORA #8: Proteger contra tipoCredito null/undefined con fallback a string vacío
        esAmortizacion: (creditoNormalizado.tipoCredito || '').toLowerCase().includes('amortizacion'),
        esExpressCredito: (creditoNormalizado.tipoCredito || '').toLowerCase().includes('express')
      };
    }).filter(Boolean); // Eliminar nulls

    // 4. Filtrar solo créditos EN CURSO
    const creditosActivos = creditosValidados.filter(
      (c: any) => c.estado === 'EN CURSO'
    );

    // 5. MEJORA #10: Eliminar duplicados por prestamo_ID
    const creditosUnicos = creditosActivos.reduce((acc: any[], credito: any) => {
      const existe = acc.find(c => c.prestamo_ID === credito.prestamo_ID);
      if (!existe) {
        acc.push(credito);
      } else {
        console.warn(`⚠️ Crédito duplicado omitido: ${credito.prestamo_ID}`);
      }
      return acc;
    }, []);

    console.log(`✅ Créditos procesados: ${creditosUnicos.length} únicos de ${creditos.length} totales`);

    // 6. Responder
    return NextResponse.json(creditosUnicos);

  } catch (error: any) {
    console.error('❌ Error en API de crédito:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json(
        { error: 'Tiempo de espera agotado. Intenta nuevamente.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error al consultar los créditos',
        details: error.response?.data || error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}