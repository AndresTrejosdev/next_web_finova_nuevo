import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prestamo_ID, cedula, monto, tipoPago } = body;

    if (!prestamo_ID || !cedula || !monto) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos (prestamo_ID, cedula, monto)' },
        { status: 400 }
      );
    }

    console.log('Iniciando pago con PayValida:', { prestamo_ID, cedula, monto, tipoPago });

    // USAR HOST DOCKER INTERNAL PARA ACCEDER AL GATEWAY
    const GATEWAY_URL = 'http://host.docker.internal:5151';

    // Generar ordenId único
    const ordenId = `ORD_${prestamo_ID}_${Date.now()}`;

    const response = await fetch(`${GATEWAY_URL}/generarLink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombreCliente: `Cliente_${cedula}`,
        email: `cliente_${cedula}@finova.com.co`,
        ordenId: ordenId,
        amount: monto,
        identification: cedula,
        identificationType: "CC",
        metodoPago: "PSE"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del gateway:', response.status, errorText);
      
      return NextResponse.json(
        { success: false, error: 'Error al iniciar pago en el gateway', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.text(); // PayValida retorna texto, no JSON
    console.log('Respuesta del gateway:', data);

    // La respuesta es directamente la URL de PayValida
    const urlPago = data.trim();

    if (!urlPago.includes('payvalida.com')) {
      console.error('Respuesta inesperada del gateway:', data);
      return NextResponse.json(
        { success: false, error: 'Respuesta inesperada del gateway', data: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      urlPago: urlPago,
      transaccion: ordenId
    });

  } catch (error: any) {
    console.error('Error en endpoint de PayValida:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar el pago', details: error.message },
      { status: 500 }
    );
  }
}
