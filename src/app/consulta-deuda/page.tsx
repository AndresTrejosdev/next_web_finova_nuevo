'use client';

import { useState } from 'react';
import axios from 'axios';

interface Cuota {
  numero: number;
  fecha: string;
  cuota: number;
  mora: number;
  sancion: number;
  estado: string;
}

interface Credito {
  prestamo_ID: number;
  documento: string;
  tipoCredito: string;
  estado: string;
  valorPrestamo: number;
  numeroCuotas: number;
  diasMora: number;
  pagoMinimo: number;
  pagoTotal: number;
  pagoEnMora: number;
  cuotas: Cuota[];
}

export default function ConsultaDeuda() {
  const [cedula, setCedula] = useState('');
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creditoSeleccionado, setCreditoSeleccionado] = useState<Credito | null>(null);

  const handleConsultar = async () => {
    if (!cedula || cedula.length < 6) {
      setError('Por favor ingresa una cédula válida');
      return;
    }

    setLoading(true);
    setError('');
    setCreditos([]);

    try {
      console.log('Consultando con cédula:', cedula);
      
      const response = await axios.get(`/api/credito?cedula=${cedula}`, {
        timeout: 20000
      });

      console.log('Respuesta completa:', response.data);

      if (response.data.success && response.data.creditos && response.data.creditos.length > 0) {
        console.log('Créditos encontrados:', response.data.creditos);
        setCreditos(response.data.creditos);
      } else {
        setError('No se encontraron créditos activos para esta cédula');
      }
    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Respuesta del error:', err.response?.data);
      setError(err.response?.data?.error || 'Error al consultar la deuda');
    } finally {
      setLoading(false);
    }
  };

  const handlePagar = (credito: Credito) => {
    setCreditoSeleccionado(credito);
    setShowModal(true);
  };

  const procesarPago = async (tipoPago: 'minimo' | 'total' | 'mora') => {
    if (!creditoSeleccionado) return;

    const montoPagar = tipoPago === 'minimo' 
      ? creditoSeleccionado.pagoMinimo 
      : tipoPago === 'total' 
        ? creditoSeleccionado.pagoTotal 
        : creditoSeleccionado.pagoEnMora;

    try {
      const responsePago = await axios.post('/api/payvalida/iniciar-pago', {
        prestamo_ID: creditoSeleccionado.prestamo_ID,
        cedula: creditoSeleccionado.documento,
        monto: montoPagar,
        tipoPago: tipoPago
      });

      if (responsePago.data.success && responsePago.data.urlPago) {
        window.location.href = responsePago.data.urlPago;
      } else {
        alert('Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al procesar el pago');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Consulta tu Crédito
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
              placeholder="Número de cédula"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleConsultar()}
            />
            <button
              onClick={handleConsultar}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Consultando créditos...</p>
          </div>
        )}

        {creditos.length > 0 && creditos.map((credito) => (
          <div key={credito.prestamo_ID} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Crédito #{credito.prestamo_ID}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-semibold">{credito.tipoCredito}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="font-semibold">{credito.estado}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor Préstamo</p>
                  <p className="font-semibold">${credito.valorPrestamo?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Días en Mora</p>
                  <p className="font-semibold text-red-600">{credito.diasMora || 0}</p>
                </div>
              </div>

              <button
                onClick={() => handlePagar(credito)}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Realizar Pago
              </button>
            </div>

            <h3 className="text-lg font-bold mb-3">Cuotas Pendientes</h3>
            {credito.cuotas && credito.cuotas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">FECHA</th>
                      <th className="px-4 py-3 text-right">CUOTA</th>
                      <th className="px-4 py-3 text-right">MORA</th>
                      <th className="px-4 py-3 text-right">SANCIÓN</th>
                      <th className="px-4 py-3 text-center">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credito.cuotas.map((cuota) => (
                      <tr 
                        key={cuota.numero}
                        className={`border-b ${cuota.estado === 'VENCIDA' ? 'bg-red-50' : ''}`}
                      >
                        <td className="px-4 py-3">{cuota.numero}</td>
                        <td className="px-4 py-3">{cuota.fecha}</td>
                        <td className="px-4 py-3 text-right">${cuota.cuota?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">${cuota.mora?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">${cuota.sancion?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            cuota.estado === 'VENCIDA' 
                              ? 'bg-red-200 text-red-800' 
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {cuota.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No hay cuotas pendientes</p>
            )}
          </div>
        ))}
      </div>

      {showModal && creditoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Opciones de Pago</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => procesarPago('minimo')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
              >
                Pago Mínimo: ${creditoSeleccionado.pagoMinimo?.toLocaleString()}
              </button>

              {creditoSeleccionado.pagoEnMora > 0 && (
                <button
                  onClick={() => procesarPago('mora')}
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700"
                >
                  Pago en Mora: ${creditoSeleccionado.pagoEnMora?.toLocaleString()}
                </button>
              )}

              <button
                onClick={() => procesarPago('total')}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
              >
                Pago Total: ${creditoSeleccionado.pagoTotal?.toLocaleString()}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
