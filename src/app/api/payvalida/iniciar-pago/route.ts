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

    // IP del contenedor de pagos en la red Docker
    const GATEWAY_URL = 'https://pago.finova.com.co';

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

    const data = await response.text();
    

    let urlPago = data.trim();

    // Si la URL no tiene protocolo, agregar https://
    if (!urlPago.startsWith('http://') && !urlPago.startsWith('https://')) {
      urlPago = `https://${urlPago}`;
      console.log('✅ Protocolo agregado a la URL:', urlPago);
    }

    if (!urlPago.includes('payvalida.com')) {
      console.error('Respuesta inesperada del gateway:', data);
      return NextResponse.json(
        { success: false, error: 'Respuesta inesperada del gateway', data: data },
        { status: 500 }
      );
    }

    console.log('🔗 URL final de pago:', urlPago);

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
