import { NextResponse } from 'next/server';

interface Cuota {
  numero: number;
  fecha: string;
  cuota: number;
  mora: number;
  sancion: number;
  estado: string;
}

interface Credito {
  prestamo_ID: number;
  documento: string;
  tipoCredito: string;
  estado: string;
  valorPrestamo: number;
  numeroCuotas: number;
  diasMora: number;
  pagoMinimo: number;
  pagoTotal: number;
  pagoEnMora: number;
  cuotas: Cuota[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userDocumento } = body;

    console.log(' [CREDITO] Consulta para documento:', userDocumento);

    if (!userDocumento) {
      console.error(' [CREDITO] Falta documento');
      return NextResponse.json(
        { error: 'El documento es requerido' },
        { status: 400 }
      );
    }

    //  CORRECTO - Sin NEXT_PUBLIC_
    const API_URL = process.env.API_URL || 'https://server.finova.com.co';
    const endpoint = `${API_URL}/api/credito`;
    
    console.log(' [CREDITO] Backend URL:', endpoint);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userDocumento }),
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    console.log(' [CREDITO] Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [CREDITO] Backend error:', errorText);
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Error al consultar créditos en el backend',
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(' [CREDITO] Datos recibidos:', {
      type: typeof data,
      isArray: Array.isArray(data),
      length: Array.isArray(data) ? data.length : 'N/A'
    });

    // Transformar datos
    const creditos: Credito[] = Array.isArray(data) ? data.filter(
      (c: any) => c.estado === 'EN CURSO'
    ).map((credito: any) => ({
      prestamo_ID: credito.prestamo_ID,
      documento: credito.documento || userDocumento,
      tipoCredito: credito.tipoCredito || 'Crédito',
      estado: credito.estado,
      valorPrestamo: credito.valor_prestamo || 0,
      numeroCuotas: credito.numero_cuotas || 0,
      diasMora: credito.dias_mora || 0,
      pagoMinimo: credito.pagoMinimo || 0,
      pagoTotal: credito.pagoTotal || 0,
      pagoEnMora: credito.pagoEnMora || 0,
      cuotas: credito.amortizacion || []
    })) : [];

    console.log(' [CREDITO] Créditos procesados:', creditos.length);

    return NextResponse.json(creditos);

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('⏱️ [CREDITO] Timeout');
      return NextResponse.json(
        { error: 'Timeout al consultar el backend' },
        { status: 504 }
      );
    }

    console.error(' [CREDITO] Error:', error.message);
    return NextResponse.json(
      { error: 'Error interno', details: error.message },
      { status: 500 }
    );
  }
}
