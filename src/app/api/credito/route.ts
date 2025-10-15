import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || 'https://app.finova.com.co';

export async function POST (request: NextRequest) {

    try {

        const body = await request.json();
        const { userDocumento } = body;

        if (!userDocumento) {

            return NextResponse.json(
                {error: 'Cédula requerida'},
                {status: 400}
            );
        }

        const response = await axios.post(

            `${API_URL}/api/credit/cuotasPendiente`,
      { userDocumento },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );
    return NextResponse.json(response.data);
     } catch (error: any){
        console.error('Error al consultar créditos:', error.message || error);

        if (error.response){

            return NextResponse.json(

                {error: error.response.data?.error || 'Error desde el backend'},
                {status: error.response.status || 500}
            );
        }
        return NextResponse.json(

            {error: 'Error al consultar créditos'},
            {status: 500}

        );

        }
    }