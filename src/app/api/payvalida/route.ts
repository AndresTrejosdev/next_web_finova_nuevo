import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PAYVALIDA_API = process.env.NEXT_PUBLIC_PAYVALIDA_API || 'https://pago.finova.com.co';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombreCliente,
      email,
      amount,
      identification,
      identificationType = 'CC',
      metodoPago,
      ordenId,
      prestamoId
    } = body;

    // Validaciones
    if (!amount || amount < 1000) {
      return NextResponse.json(
        { error: 'Monto mínimo de $1,000' },
        { status: 400 }
      );
    }

    if (!identification || !email || !nombreCliente) {
      return NextResponse.json(
        { error: 'Datos incompletos: se requiere nombre, email y cédula' },
        { status: 400 }
      );
    }

    if (!ordenId) {
      return NextResponse.json(
        { error: 'ordenId es requerido' },
        { status: 400 }
      );
    }

    console.log('📤 Enviando a PayValida:', {
      nombreCliente,
      email,
      amount,
      identification,
      ordenId
    });

    // Llamar a PayValida
    const response = await axios.post(
      `${PAYVALIDA_API}/generarLink`,
      {
        nombreCliente,
        email,
        amount,
        identification,
        identificationType,
        metodoPago: metodoPago || 'pse',
        ordenId
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log('✅ Respuesta de PayValida:', response.data);

    // Construir URL completa
    const link = response.data;
    const urlCompleta = typeof link === 'string' 
      ? (link.startsWith('http') ? link : `https://${link}`)
      : link.url || link.paymentUrl || '';

    if (!urlCompleta) {
      throw new Error('PayValida no retornó una URL válida');
    }

    return NextResponse.json({ 
      url: urlCompleta,
      ordenId,
      status: 'success'
    });

  } catch (error: any) {
    console.error('❌ Error al generar link de pago:', error.message);
    console.error('Detalles:', error.response?.data);
    
    return NextResponse.json(
      { 
        error: error.response?.data?.message || 'Error al procesar el pago',
        details: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
}
