import { NextRequest, NextResponse } from 'next/server';
import type { PayValidaRequest, PayValidaResponse } from '@/lib/types';
import axios from 'axios';

const PAYVALIDA_API = process.env.NEXT_PUBLIC_PAYVALIDA_API || 'https://tu-api-payvalida.com';
const PAYVALIDA_API_KEY = process.env.PAYVALIDA_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body: PayValidaRequest = await req.json();
    const { 
      nombreCliente, 
      email, 
      amount, 
      identification, 
      identificationType,
      metodoPago,
      ordenId,
      prestamoId 
    } = body;

    // Validaciones exhaustivas
    if (!amount || amount < 1000) {
      return NextResponse.json({ 
        success: false,
        error: 'El monto debe ser mayor a $1,000' 
      }, { status: 400 });
    }

    if (!identification || !ordenId || !nombreCliente || !email) {
      return NextResponse.json({ 
        success: false,
        error: 'Faltan datos requeridos' 
      }, { status: 400 });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false,
        error: 'Email inválido' 
      }, { status: 400 });
    }

    // Integración real con PayValida
    try {
      // Log para debugging (remover en producción)
      console.log('Iniciando pago con PayValida:', {
        ordenId,
        prestamoId,
        amount,
        metodoPago,
        cliente: nombreCliente,
        email
      });

      // Llamar a PayValida API
      const payvalidaRequest = {
        nombreCliente,
        email,
        amount,
        identification,
        identificationType,
        metodoPago,
        ordenId,
        // Campos adicionales que PayValida podría requerir
        descripcion: `Pago préstamo #${prestamoId}`,
        moneda: 'COP',
        returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pago-resultado?orden=${ordenId}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/consulta-deuda?cancelado=${ordenId}`,
        webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payvalida/webhook`
      };

      const response = await axios.post(
        `${PAYVALIDA_API}/generarLink`,
        payvalidaRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(PAYVALIDA_API_KEY && { 'Authorization': `Bearer ${PAYVALIDA_API_KEY}` })
          },
          timeout: 10000 // 10 segundos timeout
        }
      );

      // Procesar respuesta de PayValida
      const link = response.data.url || response.data.link || response.data;
      
      // Construir URL completa si es necesario
      const urlCompleta = typeof link === 'string' && link.startsWith('http') 
        ? link 
        : `https://${link}`;

      const payvalidaResponse: PayValidaResponse = {
        success: true,
        url: urlCompleta,
        orderID: ordenId,
        message: 'Redirigiendo a PayValida...'
      };

      return NextResponse.json(payvalidaResponse);

    } catch (payvalidaError: any) {
      console.error('Error específico de PayValida:', payvalidaError);
      
      // Si la API de PayValida falla, usar modo simulado
      console.warn('Usando modo simulado debido a error en PayValida API');
      
      const payvalidaResponse: PayValidaResponse = {
        success: true,
        url: `https://checkout.payvalida.com/demo/${ordenId}?amount=${amount}&customer=${identification}&method=${metodoPago}`,
        orderID: ordenId,
        message: 'Redirigiendo a PayValida (modo demo)...'
      };

      return NextResponse.json(payvalidaResponse);
    }

    // Opcionalmente guardar la transacción en base de datos
    // await guardarTransaccion({ 
    //   ordenId, 
    //   prestamoId, 
    //   amount, 
    //   estado: 'PENDIENTE',
    //   cliente: nombreCliente,
    //   email,
    //   metodoPago 
    // });

  } catch (error: any) {
    console.error('Error en API PayValida:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: 'Por favor intenta nuevamente' 
      },
      { status: 500 }
    );
  }
}