import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: 'API URL no configurada' }, { status: 500 });
    }

    if (!cedula) {
      return NextResponse.json({ error: 'Cedula requerida' }, { status: 400 });
    }

    console.log('Consultando API externa:', `${apiUrl}/api/credit/cuotasPendiente`);
    console.log('Documento:', cedula);

    const response = await fetch(`${apiUrl}/api/credit/cuotasPendiente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userDocumento: cedula })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del API externo:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Error del API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Respuesta del API externo:', data);
    
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: 'No se encontraron créditos',
        creditos: [] 
      });
    } 

    const creditosActivos = data.filter((credito: any) => 
      credito.estado !== 'CANCELADO' && credito.estado !== 'PAGADO'
    );

    if (creditosActivos.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: 'No hay créditos activos',
        creditos: [] 
      });
    }

    const creditosTransformados = creditosActivos.map((credito: any) => {
      const todasLasCuotas = credito.amortizacion || [];
      
      const cuotasValidas = todasLasCuotas
        .filter((c: any) => parseFloat(c.total_cuota || 0) > 0)
        .map((cuota: any) => {
          const fechaCuota = new Date(cuota.fecha_pago);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          fechaCuota.setHours(0, 0, 0, 0);
          
          const estaVencida = fechaCuota < hoy;
          const sancion = parseFloat(cuota.sancion || 0);
          
          return {
            numero: parseInt(cuota.Numero_cuota || cuota.numero_cuota || 0),
            fecha: cuota.fecha_pago,
            cuota: parseFloat(cuota.total_cuota || 0),
            mora: sancion,
            sancion: sancion,
            estado: estaVencida ? 'VENCIDA' : 'PENDIENTE',
            capital: parseFloat(cuota.capital || 0),
            interes: parseFloat(cuota.interes || 0),
            aval: parseFloat(cuota.aval || 0),
            saldo: parseFloat(cuota.saldo || 0)
          };
        })
        .sort((a, b) => a.numero - b.numero);

      return {
        prestamo_ID: credito.prestamo_ID,
        documento: credito.documento,
        tipoCredito: credito.tipoCredito,
        estado: credito.estado,
        valorPrestamo: parseFloat(credito.valor_prestamo || 0),
        numeroCuotas: parseInt(credito.numero_cuotas || 0),
        diasMora: credito.diasMora || 0,
        pagoMinimo: parseFloat(credito.pagoMinimo || 0),
        pagoTotal: parseFloat(credito.pagoTotal || 0),
        pagoEnMora: parseFloat(credito.pagoEnMora || 0),
        cuotas: cuotasValidas
      };
    });

    return NextResponse.json({
      success: true,
      creditos: creditosTransformados
    });
    
  } catch (error: any) {
    console.error('Error en API de creditos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al procesar la solicitud', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}