import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * FUNCIÓN HELPER PARA PARSEAR FECHAS DE FORMA SEGURA
 * Con manejo robusto de errores para evitar crashes del servidor
 */
function parseFechaSafe(fecha: any): Date {
  try {
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
  } catch (error) {
    console.error('Error parseando fecha:', error);
  }
  
  return new Date();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userDocumento } = body;

    if (!userDocumento) {
      return NextResponse.json(
        { error: 'Número de documento requerido' },
        { status: 400 }
      );
    }

    console.log('🔍 Consultando créditos para:', userDocumento);

    const axiosConfig = {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
      validateStatus: (status: number) => status < 500, // No lanzar error en 4xx
    };

    // OBTENER URLS DE VARIABLES DE ENTORNO
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const panelUrl = process.env.NEXT_PUBLIC_PANEL_URL;

    if (!apiUrl || !panelUrl) {
      throw new Error('Variables de entorno no configuradas');
    }

    // Consultar créditos con manejo de error
    let responseCreditos;
    try {
      responseCreditos = await axios.post(
        `${apiUrl}/api/credit/cuotasPendiente`,
        { userDocumento },
        axiosConfig
      );

      console.log('📊 [DIAGNÓSTICO] Respuesta del backend:', {
        status: responseCreditos.status,
        hasData: !!responseCreditos.data,
        dataType: typeof responseCreditos.data,
        isArray: Array.isArray(responseCreditos.data)
      });

      // Si el backend retorna error, manejarlo
      if (responseCreditos.status >= 400) {
        console.error('❌ Backend retornó error:', responseCreditos.status, responseCreditos.data);
        return NextResponse.json(
          { error: 'Error al consultar créditos en el sistema', details: responseCreditos.data },
          { status: responseCreditos.status }
        );
      }
    } catch (error: any) {
      console.error('❌ Error en consulta de créditos:', error.message);
      return NextResponse.json(
        { error: 'No se pudo conectar con el servidor de créditos', details: error.message },
        { status: 503 }
      );
    }

    // Consultar usuario con manejo de error
    let responseUsuario;
    try {
      responseUsuario = await axios.post(
        `${panelUrl}/api/menu/index`,
        { userDocumento },
        axiosConfig
      );

      if (responseUsuario.status >= 400) {
        console.warn('⚠️ No se pudo obtener datos del usuario, usando defaults');
        responseUsuario = { data: {} };
      }
    } catch (error) {
      console.warn('⚠️ Error al consultar usuario, continuando con defaults');
      responseUsuario = { data: {} };
    }

    const creditos = Array.isArray(responseCreditos.data) ? responseCreditos.data : [];
    const datosUsuario = responseUsuario.data || {};

    console.log(`📊 [DIAGNÓSTICO] Datos recibidos:`, {
      creditosCount: creditos.length,
      hasUsuario: !!datosUsuario.nombre,
      primerosCreditos: creditos.slice(0, 2).map(c => ({
        id: c.prestamo_ID || c.id,
        estado: c.estado,
        hasAmortizacion: !!(c.amortizacion || c.cuotas || c.pagos)
      }))
    });

    if (creditos.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron créditos para este documento' },
        { status: 404 }
      );
    }

    console.log(`📊 Procesando ${creditos.length} créditos`);

    // Procesar créditos con protección contra errores
    const creditosProcesados = creditos.map((credito: any, index: number) => {
      try {
        // Validación básica
        if (!credito || typeof credito !== 'object') {
          console.warn(`⚠️ Crédito ${index} inválido`);
          return null;
        }

        const prestamoId = credito.prestamo_ID || credito.prestamoId || credito.id;
        if (!prestamoId) {
          console.warn(`⚠️ Crédito ${index} sin ID`);
          return null;
        }

        console.log(`🔍 [DIAGNÓSTICO] Procesando crédito ${prestamoId}:`, {
          camposDisponibles: Object.keys(credito),
          tipoCredito: credito.tipoCredito,
          estado: credito.estado
        });

        // Buscar amortización de forma segura
        let amortizacion = [];
        try {
          // ESCENARIO 1: Buscar múltiples nombres de amortización
          amortizacion = credito.amortizacion 
            || credito.cuotas 
            || credito.pagos 
            || credito.plan_pagos
            || credito.planPagos
            || credito.detalleCuotas
            || credito.cronograma
            || credito.cuotasPendientes
            || credito.schedule
            || [];

          console.log(`🔍 [DIAGNÓSTICO] Amortización encontrada en ${prestamoId}:`, {
            campo: credito.amortizacion ? 'amortizacion' : 
                   credito.cuotas ? 'cuotas' :
                   credito.pagos ? 'pagos' : 
                   credito.plan_pagos ? 'plan_pagos' :
                   credito.planPagos ? 'planPagos' :
                   credito.detalleCuotas ? 'detalleCuotas' :
                   credito.cronograma ? 'cronograma' :
                   credito.cuotasPendientes ? 'cuotasPendientes' :
                   credito.schedule ? 'schedule' : 'ninguno',
            tipo: typeof amortizacion,
            esArray: Array.isArray(amortizacion),
            longitud: Array.isArray(amortizacion) ? amortizacion.length : 'N/A'
          });

          // Si es string, intentar parsear
          if (typeof amortizacion === 'string') {
            try {
              amortizacion = JSON.parse(amortizacion);
              console.log(`✅ JSON parseado exitosamente para ${prestamoId}`);
            } catch (e) {
              console.warn(`⚠️ No se pudo parsear JSON para ${prestamoId}`);
              amortizacion = [];
            }
          }

          // Asegurar que sea array
          if (!Array.isArray(amortizacion)) {
            console.warn(`⚠️ Amortización no es array para ${prestamoId}, convirtiendo`);
            amortizacion = [];
          }
        } catch (error) {
          console.error(`⚠️ Error procesando amortización de crédito ${prestamoId}:`, error);
          amortizacion = [];
        }

        // ESCENARIO 2: Normalizar campos dentro de cada cuota de forma segura
        const amortizacionNormalizada = amortizacion.map((cuota: any, idx: number) => {
          try {
            if (!cuota || typeof cuota !== 'object') {
              console.warn(`⚠️ Cuota ${idx} inválida en ${prestamoId}`);
              return {
                numeroCuota: idx + 1,
                fecha: new Date().toISOString(),
                valorCuota: 0,
                mora: 0,
                sancion: 0,
                estado: 'PENDIENTE'
              };
            }

            // Normalizar fecha
            let fechaNormalizada = cuota.fecha || cuota.fechaVencimiento || cuota.fecha_vencimiento || cuota.vencimiento || cuota.fechaVto;
            if (!fechaNormalizada) {
              fechaNormalizada = new Date().toISOString();
            }

            // Normalizar monto
            let valorCuota = 0;
            const camposMonto = ['valorCuota', 'valor_cuota', 'monto', 'valor', 'montoCuota', 'capital'];
            for (const campo of camposMonto) {
              const valor = Number(cuota[campo]);
              if (!isNaN(valor) && valor > 0) {
                valorCuota = Math.abs(valor);
                break;
              }
            }

            // Normalizar mora
            let mora = 0;
            const camposMora = ['mora', 'interesMora', 'interes_mora', 'interes', 'interesMoratorio'];
            for (const campo of camposMora) {
              const valor = Number(cuota[campo]);
              if (!isNaN(valor) && valor >= 0) {
                mora = Math.abs(valor);
                break;
              }
            }

            // Normalizar sanción
            let sancion = 0;
            const camposSancion = ['sancion', 'multa', 'penalizacion'];
            for (const campo of camposSancion) {
              const valor = Number(cuota[campo]);
              if (!isNaN(valor) && valor >= 0) {
                sancion = Math.abs(valor);
                break;
              }
            }

            // Normalizar estado
            let estado = String(cuota.estado || cuota.status || cuota.state || 'PENDIENTE').toUpperCase();

            console.log(`🔍 [DIAGNÓSTICO] Cuota ${idx} normalizada para ${prestamoId}:`, {
              fecha: fechaNormalizada,
              valorCuota,
              mora,
              sancion,
              estado
            });

            return {
              numeroCuota: cuota.numeroCuota || cuota.numero_cuota || cuota.numero || (idx + 1),
              fecha: fechaNormalizada,
              valorCuota,
              mora,
              sancion,
              estado
            };
          } catch (error) {
            console.error(`⚠️ Error normalizando cuota ${idx} en ${prestamoId}:`, error);
            return {
              numeroCuota: idx + 1,
              fecha: new Date().toISOString(),
              valorCuota: 0,
              mora: 0,
              sancion: 0,
              estado: 'PENDIENTE'
            };
          }
        });

        // Calcular mora de forma segura
        let pagoEnMora = 0;
        try {
          const fechaHoy = new Date();
          fechaHoy.setHours(0, 0, 0, 0);

          amortizacionNormalizada.forEach((cuota: any) => {
            try {
              const fechaVencimiento = parseFechaSafe(cuota.fecha);
              fechaVencimiento.setHours(0, 0, 0, 0);

              if (fechaVencimiento <= fechaHoy && cuota.estado !== 'PAGADA' && cuota.mora > 0) {
                pagoEnMora += cuota.mora + cuota.sancion;
              }
            } catch (e) {
              // Ignorar cuotas con error
            }
          });
        } catch (error) {
          console.error('⚠️ Error calculando mora:', error);
        }

        // Retornar crédito procesado con valores seguros
        const creditoProcesado = {
          prestamo_ID: prestamoId,
          tipoCredito: String(credito.tipoCredito || credito.tipo_credito || 'CRÉDITO'),
          estado: String(credito.estado || 'DESCONOCIDO'),
          pagoMinimo: Math.abs(Number(credito.pagoMinimo || credito.pago_minimo || credito.cuotaMinima || 0) || 0),
          pagoTotal: Math.abs(Number(credito.pagoTotal || credito.pago_total || credito.saldoTotal || 0) || 0),
          pagoEnMora: pagoEnMora,
          amortizacion: amortizacionNormalizada,
          documento: userDocumento,
          nombreCompleto: String(datosUsuario.nombre || datosUsuario.nombreCompleto || 'Cliente Finova'),
          email: String(datosUsuario.email || datosUsuario.correo || 'cliente@finova.com.co'),
          telefono: String(datosUsuario.telefono || datosUsuario.celular || ''),
          ciudad: String(datosUsuario.ciudad || ''),
          esAmortizacion: String(credito.tipoCredito || '').toLowerCase().includes('amortizacion'),
          esExpressCredito: String(credito.tipoCredito || '').toLowerCase().includes('express')
        };

        console.log(`✅ [DIAGNÓSTICO] Crédito ${prestamoId} procesado:`, {
          pagoMinimo: creditoProcesado.pagoMinimo,
          pagoTotal: creditoProcesado.pagoTotal,
          pagoEnMora: creditoProcesado.pagoEnMora,
          cuotasCount: creditoProcesado.amortizacion.length
        });

        return creditoProcesado;
      } catch (error: any) {
        console.error(`❌ Error procesando crédito ${index}:`, error.message);
        return null;
      }
    }).filter(Boolean); // Eliminar nulls

    // Filtrar solo créditos EN CURSO
    const creditosActivos = creditosProcesados.filter(
      (c: any) => c && c.estado === 'EN CURSO'
    );

    console.log(`✅ Resultado final: ${creditosActivos.length} créditos activos de ${creditos.length} totales`);

    return NextResponse.json(creditosActivos);

  } catch (error: any) {
    console.error('❌ Error crítico en API:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Por favor contacte a soporte',
        details: error.stack
      },
      { status: 500 }
    );
  }
}