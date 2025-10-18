import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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

    // 1. Consultar créditos
    const responseCreditos = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/credit/cuotasPendiente`,
      { userDocumento },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    // 2. Obtener datos del usuario (nombre, email)
    const responseUsuario = await axios.post(
      `${process.env.NEXT_PUBLIC_PANEL_URL}/api/menu/index`,
      { userDocumento },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const creditos = responseCreditos.data;
    const datosUsuario = responseUsuario.data;

    // 3. Enriquecer cada crédito con datos del usuario y calcular mora correctamente
    const creditosEnriquecidos = creditos.map((credito: any) => {
      // CORRECCIÓN CRÍTICA: Calcular mora solo de cuotas VENCIDAS
      const fechaHoy = new Date();
      fechaHoy.setHours(0, 0, 0, 0);

      let pagoEnMoraCorregido = 0;
      
      if (credito.amortizacion && Array.isArray(credito.amortizacion)) {
        credito.amortizacion.forEach((cuota: any) => {
          const fechaVencimiento = new Date(cuota.fecha);
          fechaVencimiento.setHours(0, 0, 0, 0);

          // Solo incluir si:
          // 1. Está vencida (fecha <= hoy)
          // 2. NO está pagada
          // 3. Tiene mora > 0
          if (
            fechaVencimiento <= fechaHoy &&
            cuota.estado !== 'PAGADA' &&
            cuota.mora > 0
          ) {
            pagoEnMoraCorregido += cuota.mora + (cuota.sancion || 0);
          }
        });
      }

      return {
        ...credito,
        documento: userDocumento,
        nombreCompleto: datosUsuario.nombre || 'Cliente Finova',
        email: datosUsuario.email || 'cliente@finova.com.co',
        telefono: datosUsuario.telefono || '',
        ciudad: datosUsuario.ciudad || '',
        // Sobrescribir con el cálculo correcto
        pagoEnMora: pagoEnMoraCorregido,
        // Agregar flag para identificar tipo de crédito
        esAmortizacion: credito.tipoCredito?.toLowerCase().includes('amortizacion'),
        esExpressCredito: credito.tipoCredito?.toLowerCase().includes('express')
      };
    });

    // 4. Filtrar solo créditos EN CURSO
    const creditosActivos = creditosEnriquecidos.filter(
      (c: any) => c.estado === 'EN CURSO'
    );

    return NextResponse.json(creditosActivos);

  } catch (error: any) {
    console.error('Error en API de crédito:', error.message);
    
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