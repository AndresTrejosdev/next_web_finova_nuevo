"use client";

import { useState } from 'react';
import axios from 'axios';
import type { Credito, Amortizacion } from '@/lib/types';
import ModalPago from '../Components/ModalPago';

export default function ConsultaDeuda() {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [error, setError] = useState('');
  const [mostrarAmortizacion, setMostrarAmortizacion] = useState<{ [key: number]: boolean }>({});
  
  // Estados para el modal de pago
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [creditoSeleccionado, setCreditoSeleccionado] = useState<Credito | null>(null);

  const handleConsultar = async () => {
    if (!cedula || cedula.length < 6) {
      setError('Por favor ingresa una cédula válida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('panel.finova.com.co/api/menu/index', {
        "userDocumento": cedula
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

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const toggleAmortizacion = (prestamoId: number) => {
    setMostrarAmortizacion(prev => ({
      ...prev,
      [prestamoId]: !prev[prestamoId]
    }));
  };

  const handlePagar = (credito: Credito) => {
    setCreditoSeleccionado(credito);
    setModalPagoAbierto(true);
  };

  const cerrarModal = () => {
    setModalPagoAbierto(false);
    setCreditoSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Consulta tu Estado de Créditos
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
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Tus Créditos Activos</h2>
              
              {creditos.map((credito, index) => (
                <div key={credito.prestamo_ID} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                  
                  {/* Header del crédito */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{credito.tipoCredito}</h3>
                        <p className="text-sm text-gray-600">
                          Préstamo #{credito.prestamo_ID} • {credito.periocidad}
                        </p>
                        <p className="text-sm text-gray-500">
                          Registrado: {formatDate(credito.fecha_registro)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          credito.estado === 'EN CURSO' ? 'bg-green-100 text-green-800' :
                          credito.estado === 'CANCELADO' ? 'bg-gray-100 text-gray-800' :
                          credito.estado === 'JURIDICO' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {credito.estado}
                        </span>
                        <p className="text-sm text-gray-600 mt-2">
                          Tasa: {credito.tasa}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información del préstamo */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Valor Préstamo</p>
                        <p className="text-xl font-bold text-blue-700">
                          {formatCurrency(credito.valor_prestamo)}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Valor Cuota</p>
                        <p className="text-xl font-bold text-purple-700">
                          {formatCurrency(credito.valor_cuota)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {credito.numero_cuotas} cuotas • {credito.plazo} meses
                        </p>
                      </div>

                      {credito.pagoMinimo > 0 && (
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Pago Mínimo</p>
                          <p className="text-xl font-bold text-orange-700">
                            {formatCurrency(credito.pagoMinimo)}
                          </p>
                        </div>
                      )}

                      {credito.pagoTotal > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Pago Total</p>
                          <p className="text-xl font-bold text-green-700">
                            {formatCurrency(credito.pagoTotal)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Información adicional para créditos EN CURSO */}
                    {credito.estado === 'EN CURSO' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Cuotas Pendientes</p>
                          <p className="text-lg font-semibold">{credito.cuotasConSaldo}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Capital Pendiente</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(credito.capital)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Próximo Pago</p>
                          <p className="text-lg font-semibold">
                            {credito.FechaPago ? formatDate(credito.FechaPago) : formatDate(credito.fecha_Pago)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Alerta de mora */}
                    {credito.pagoEnMora > 0 && (
                      <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                              Tienes pagos en mora
                            </p>
                            <p className="text-xl font-bold text-red-600">
                              {formatCurrency(credito.pagoEnMora)}
                            </p>
                            <p className="text-sm text-red-600">
                              Días en mora: {credito.diasMora}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-4 mb-4">
                      {(credito.pagoMinimo > 0 || credito.pagoTotal > 0) && (
                        <button
                          onClick={() => handlePagar(credito)}
                          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          Pagar con PSE
                        </button>
                      )}
                      
                      <button
                        onClick={() => toggleAmortizacion(credito.prestamo_ID)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {mostrarAmortizacion[credito.prestamo_ID] ? 'Ocultar' : 'Ver'} Tabla de Pagos
                      </button>
                    </div>

                    {/* Tabla de amortización */}
                    {mostrarAmortizacion[credito.prestamo_ID] && credito.amortizacion && (
                      <div className="mt-4 overflow-x-auto">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800">Tabla de Amortización</h4>
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">Cuota</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">Fecha Pago</th>
                              <th className="px-4 py-3 text-right font-medium text-gray-700">Capital</th>
                              <th className="px-4 py-3 text-right font-medium text-gray-700">Interés</th>
                              <th className="px-4 py-3 text-right font-medium text-gray-700">Aval</th>
                              <th className="px-4 py-3 text-right font-medium text-gray-700">Total Cuota</th>
                              <th className="px-4 py-3 text-right font-medium text-gray-700">Saldo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {credito.amortizacion.map((cuota, idx) => (
                              <tr key={cuota.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-t`}>
                                <td className="px-4 py-3 font-medium">{cuota.Numero_cuota}</td>
                                <td className="px-4 py-3">{formatDate(cuota.fecha_pago)}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(cuota.capital)}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(cuota.interes)}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(cuota.aval)}</td>
                                <td className="px-4 py-3 text-right font-semibold">{formatCurrency(cuota.total_cuota)}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(cuota.saldo)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de pago */}
      {modalPagoAbierto && creditoSeleccionado && (
        <ModalPago 
          credito={creditoSeleccionado} 
          onClose={cerrarModal}
        />
      )}
    </div>
  );
}