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

    // USAR IP DIRECTA DEL GATEWAY - CAMPOS CORRECTOS SEGÚN LinkInfo
    const GATEWAY_URL = 'http://10.10.11.111:5151';

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
        metodoPago: "PSE" // o el método apropiado
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

    const data = await response.json();
    console.log('Respuesta del gateway:', data);

    // Extraer URL de pago de la respuesta
    const urlPago = data.url_pago || data.payment_url || data.urlPago || data.redirect_url || data.link || data.paymentUrl;

    if (!urlPago) {
      console.error('No se recibió URL de pago:', data);
      return NextResponse.json(
        { success: false, error: 'No se recibió URL de pago del gateway', data: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      urlPago: urlPago,
      transaccion: data.transaccion_id || data.transaction_id || data.id || data.ordenId || ordenId
    });

  } catch (error: any) {
    console.error('Error en endpoint de PayValida:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar el pago', details: error.message },
      { status: 500 }
    );
  }
}
