import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.finova.com.co';
const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL || 'https://panel.finova.com.co';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userDocumento } = body;

    if (!userDocumento) {
      return NextResponse.json(
        { error: 'Cédula requerida' },
        { status: 400 }
      );
    }

    // Llamar a ambos endpoints en paralelo
    const [creditosResponse, userDataResponse] = await Promise.all([
      // 1. Consultar créditos
      axios.post(
        `${API_URL}/api/credit/cuotasPendiente`,
        { userDocumento: userDocumento },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      ),
      // 2. Consultar datos del usuario
      axios.post(
        `${PANEL_URL}/api/menu/index`,
        { userDocumento: parseInt(userDocumento) },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      )
    ]);

    // Combinar respuestas
    const creditos = creditosResponse.data;
    const userData = userDataResponse.data;

    // Agregar datos de usuario a cada crédito
    const creditosEnriquecidos = Array.isArray(creditos) 
      ? creditos.map(credito => ({
          ...credito,
          nombreCompleto: `${userData.nombre || ''} ${userData.apellido || ''}`.trim(),
          email: userData.email || '',
          telefono: userData.celular || '',
          ciudad: userData.ciudad || ''
        }))
      : [];

    return NextResponse.json(creditosEnriquecidos);

  } catch (error: any) {
    console.error('Error al consultar créditos:', error.message);
    
    // Retornar error detallado
    return NextResponse.json(
      { 
        error: 'Error al consultar los créditos',
        details: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
}
