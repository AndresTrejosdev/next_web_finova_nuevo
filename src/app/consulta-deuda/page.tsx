"use client";

import { useState } from 'react';
import axios from 'axios';

// Tipos para mejor TypeScript
interface Credito {
                  <button
                    onClick={() => window.open('https://app.finova.com.co/apps/pay', '_blank')}
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Pagar con PSE
                  </button>stamo_ID: string;
  tipoCredito: string;
  estado: 'EN CURSO' | 'JURIDICO' | 'VENCIDO';
  pagoMinimo: number;
  pagoTotal: number;
  pagoEnMora: number;
}

export default function ConsultaDeuda() {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [error, setError] = useState('');

  const handleConsultar = async () => {
    if (!cedula || cedula.length < 6) {
      setError('Por favor ingresa una cédula válida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/credito', {
        userDocumento: cedula
      });

      setCreditos(response.data);
      
      if (response.data.length === 0) {
        setError('No se encontraron créditos asociados a esta cédula');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al consultar los créditos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Consulta tu Deuda
          </h1>

          {/* Formulario de consulta */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Cédula
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
                placeholder="Ingresa tu número de cédula"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={15}
              />
              <button
                onClick={handleConsultar}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Resultados */}
          {creditos.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Tus Créditos</h2>
              {creditos.map((credito, index) => (
                <div key={index} className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{credito.tipoCredito}</h3>
                      <p className="text-sm text-gray-600">
                        Préstamo #{credito.prestamo_ID}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      credito.estado === 'EN CURSO' ? 'bg-green-100 text-green-800' :
                      credito.estado === 'JURIDICO' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {credito.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Pago Mínimo</p>
                      <p className="text-xl font-bold text-blue-600">
                        ${credito.pagoMinimo?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pago Total</p>
                      <p className="text-xl font-bold text-gray-800">
                        ${credito.pagoTotal?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {credito.pagoEnMora > 0 && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Pago en Mora</p>
                      <p className="text-xl font-bold text-red-600">
                        ${credito.pagoEnMora?.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <button
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Pagar con PSE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
