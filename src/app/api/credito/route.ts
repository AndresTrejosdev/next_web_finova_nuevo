import { NextRequest, NextResponse } from 'next/server';

// Tipos para la respuesta
interface Credito {
  prestamo_ID: string;
  tipoCredito: string;
  estado: 'EN CURSO' | 'JURIDICO' | 'VENCIDO';
  pagoMinimo: number;
  pagoTotal: number;
  pagoEnMora: number;
}

export async function POST(request: NextRequest) {
  try {
    const { userDocumento } = await request.json();

    // Validar cédula
    if (!userDocumento || userDocumento.length < 6) {
      return NextResponse.json(
        { error: 'Número de cédula inválido' },
        { status: 400 }
      );
    }

    // NOTA: Aquí debes implementar la lógica real de consulta a tu base de datos
    // Por ahora retorno datos de ejemplo para que funcione
    
    const creditosEjemplo: Credito[] = [
      {
        prestamo_ID: "FIN-2024-001",
        tipoCredito: "Crédito Personal",
        estado: "EN CURSO",
        pagoMinimo: 150000,
        pagoTotal: 850000,
        pagoEnMora: 0
      },
      {
        prestamo_ID: "FIN-2024-002", 
        tipoCredito: "Crédito Vehicular",
        estado: "JURIDICO",
        pagoMinimo: 280000,
        pagoTotal: 1200000,
        pagoEnMora: 95000
      }
    ];

    // Simular consulta a base de datos
    // TODO: Reemplazar con consulta real a tu base de datos
    const creditos = creditosEjemplo.filter(() => Math.random() > 0.3);

    return NextResponse.json(creditos);

  } catch (error) {
    console.error('Error en API credito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}