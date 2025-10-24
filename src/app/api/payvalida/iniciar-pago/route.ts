import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Leer datos del body
    const body = await request.json();
    const { prestamo_ID, cedula, monto, tipoPago } = body;

    // Validar datos requeridos
    if (!prestamo_ID || !cedula || !monto) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Faltan datos requeridos (prestamo_ID, cedula, monto)' 
        },
        { status: 400 }
      );
    }

    // URL del gateway interno de pagos
    const apiUrl = process.env.NEXT_PUBLIC_PAYVALIDA_API;
    
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, error: 'API de pagos no configurada' },
        { status: 500 }
      );
    }

    console.log('Iniciando pago con PayValida:', {
      prestamo_ID,
      cedula,
      monto,
      tipoPago
    });

    // Llamar al gateway interno de pagos
    const response = await fetch(`${apiUrl}/api/pagos/iniciar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prestamo_ID: prestamo_ID,
        documento: cedula,
        valor: monto,
        tipo_pago: tipoPago,
        return_url: process.env.NEXT_PUBLIC_RETURN_URL || 'https://finova.com.co/success',
        cancel_url: process.env.NEXT_PUBLIC_CANCEL_URL || 'https://finova.com.co/cancel'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del gateway de pagos:', response.status, errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error al iniciar pago en el gateway',
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Respuesta del gateway de pagos:', data);

    // Extraer URL de pago (puede variar según la respuesta del gateway)
    const urlPago = data.url_pago || data.payment_url || data.urlPago || data.redirect_url;

    if (!urlPago) {
      console.error('No se recibió URL de pago:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se recibió URL de pago del gateway',
          data: data
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      urlPago: urlPago,
      transaccion: data.transaccion_id || data.transaction_id || null
    });

  } catch (error: any) {
    console.error('Error en endpoint de PayValida:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno al procesar el pago',
        details: error.message 
      },
      { status: 500 }
    );
  }
}