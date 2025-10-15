import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('Webhook PayValida recibido:', body);

    // Aquí procesarías la notificación de PayValida
    const { ordenId, estado, transactionId, amount } = body;

    // Actualizar el estado del pago en tu base de datos
    // await actualizarEstadoPago({ ordenId, estado, transactionId });

    // Responder a PayValida
    return NextResponse.json({ 
      status: 'received',
      message: 'Webhook procesado correctamente'
    });

  } catch (error: any) {
    console.error('Error procesando webhook PayValida:', error);
    
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}

// Endpoint para verificar el estado de un pago
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ordenId = searchParams.get('ordenId');

    if (!ordenId) {
      return NextResponse.json(
        { error: 'ordenId requerido' },
        { status: 400 }
      );
    }

    // Consultar estado en tu base de datos
    // const estadoPago = await consultarEstadoPago(ordenId);

    // Por ahora retornamos un estado mock
    return NextResponse.json({
      ordenId,
      estado: 'PENDIENTE',
      message: 'Pago en proceso'
    });

  } catch (error: any) {
    console.error('Error consultando estado de pago:', error);
    
    return NextResponse.json(
      { error: 'Error consultando estado' },
      { status: 500 }
    );
  }
}