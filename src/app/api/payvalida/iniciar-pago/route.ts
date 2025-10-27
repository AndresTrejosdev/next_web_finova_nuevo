import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prestamo_ID, cedula, monto, tipoPago, metodoPago } = body;

    if (!prestamo_ID || !cedula || !monto) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    console.log('Iniciando pago:', { prestamo_ID, cedula, monto, metodoPago });

    const GATEWAY_URL = 'https://pago.finova.com.co';
    const ordenId = `ORD_${prestamo_ID}_${Date.now()}`;

    const response = await fetch(`${GATEWAY_URL}/generarLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombreCliente: `Cliente_${cedula}`,
        email: `cliente_${cedula}@finova.com.co`,
        ordenId: ordenId,
        amount: monto,
        identification: cedula,
        identificationType: "CC",
        metodoPago: metodoPago || "PSE"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error gateway:', errorText);
      return NextResponse.json(
        { success: false, error: 'Error al iniciar pago' },
        { status: response.status }
      );
    }

    const data = await response.text();
    let urlPago = data.trim();

    if (!urlPago.startsWith('http')) {
      urlPago = `https://${urlPago}`;
    }

    console.log('URL generada:', urlPago);

    return NextResponse.json({
      success: true,
      urlPago: urlPago,
      transaccion: ordenId
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar pago' },
      { status: 500 }
    );
  }
}
