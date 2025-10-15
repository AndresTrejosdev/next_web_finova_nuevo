"use client";

import { useState } from 'react';
import axios from 'axios';
import type { Credito, PayValidaRequest, PayValidaResponse } from '@/lib/types';

interface ModalPagoProps {
  credito: Credito;
  onClose: () => void;
}

export default function ModalPago({ credito, onClose }: ModalPagoProps) {
  const [tipoPago, setTipoPago] = useState('pago_minimo');
  const [otroValor, setOtroValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState('pse');
  const [error, setError] = useState<string | null>(null);
  const [emailUsuario, setEmailUsuario] = useState(credito.email || '');
  const [nombreUsuario, setNombreUsuario] = useState(credito.nombreCompleto || '');

  const obtenerMonto = () => {
    switch (tipoPago) {
      case 'pago_minimo':
        return credito.pagoMinimo;
      case 'pago_total':
        return credito.pagoTotal;
      case 'pago_mora':
        return credito.pagoEnMora;
      case 'otro_valor':
        return Number(otroValor);
      default:
        return 0;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const generarOrdenId = (): string => {
    // Generación más robusta del ID de orden
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `FIN-${credito.prestamo_ID}-${timestamp}-${random}`;
  };

  const normalizarMetodoPago = (metodo: string): string => {
    const metodoMap: Record<string, string> = {
      pse: 'PSE',
      nequi: 'NEQUI',
      bancolombia: 'BANCOLOMBIA'
    };
    return metodoMap[metodo] || 'PSE';
  };

  const validarFormulario = (): string | null => {
    const monto = obtenerMonto();
    
    if (monto < 1000) {
      return 'El monto mínimo es de $1,000';
    }

    if (tipoPago === 'otro_valor' && (!otroValor || Number(otroValor) < 1000)) {
      return 'Por favor ingresa un monto válido (mínimo $1,000)';
    }

    if (!nombreUsuario.trim()) {
      return 'Por favor ingresa tu nombre completo';
    }

    if (!emailUsuario.trim()) {
      return 'Por favor ingresa tu email';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailUsuario)) {
      return 'Por favor ingresa un email válido';
    }

    return null;
  };

  const handlePagar = async () => {
    setError(null);
    
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);

    try {
      const ordenId = generarOrdenId();
      const monto = obtenerMonto();

      const requestData: PayValidaRequest = {
        nombreCliente: nombreUsuario.trim(),
        email: emailUsuario.trim(),
        amount: monto,
        identification: credito.documento,
        identificationType: 'CC',
        metodoPago: normalizarMetodoPago(metodoPago),
        ordenId: ordenId,
        prestamoId: credito.prestamo_ID
      };

      const response = await axios.post<PayValidaResponse>('/api/payvalida', requestData);

      if (response.data.success && response.data.url) {
        // Guardamos información del pago en localStorage para tracking
        localStorage.setItem('ultimoPago', JSON.stringify({
          ordenId,
          prestamoId: credito.prestamo_ID,
          monto,
          fecha: new Date().toISOString()
        }));

        // Redirigir a PayValida
        window.location.href = response.data.url;
      } else {
        setError(response.data.message || 'Error al procesar el pago');
      }
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Error de conexión. Por favor intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Realizar Pago</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>

          {/* Error global */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <p className="text-red-800 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Información del crédito */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2 text-gray-800">{credito.tipoCredito}</h3>
            <p className="text-sm text-gray-600">Préstamo #{credito.prestamo_ID}</p>
            <p className="text-sm text-gray-500">Documento: {credito.documento}</p>
          </div>

          {/* Datos del usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Tipo de pago */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecciona el tipo de pago
            </label>

            <div className="space-y-3">
              {credito.pagoMinimo > 0 && (
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="tipoPago"
                    value="pago_minimo"
                    checked={tipoPago === 'pago_minimo'}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Pago Mínimo</span>
                    <span className="float-right text-blue-600 font-bold">
                      {formatCurrency(credito.pagoMinimo)}
                    </span>
                  </div>
                </label>
              )}

              {credito.pagoTotal > 0 && (
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="tipoPago"
                    value="pago_total"
                    checked={tipoPago === 'pago_total'}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Pago Total</span>
                    <span className="float-right text-green-600 font-bold">
                      {formatCurrency(credito.pagoTotal)}
                    </span>
                  </div>
                </label>
              )}

              {credito.pagoEnMora > 0 && (
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="tipoPago"
                    value="pago_mora"
                    checked={tipoPago === 'pago_mora'}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Pago en Mora</span>
                    <span className="float-right text-red-600 font-bold">
                      {formatCurrency(credito.pagoEnMora)}
                    </span>
                  </div>
                </label>
              )}

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="tipoPago"
                  value="otro_valor"
                  checked={tipoPago === 'otro_valor'}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-medium">Otro valor:</span>
                  <input
                    type="number"
                    value={otroValor}
                    onChange={(e) => setOtroValor(e.target.value)}
                    placeholder="Mínimo $1,000"
                    disabled={tipoPago !== 'otro_valor'}
                    className="flex-1 px-3 py-1 border rounded disabled:bg-gray-100 focus:ring-1 focus:ring-blue-500"
                    min="1000"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Método de pago */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Método de pago
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pse">PSE - Débito a Cuenta Corriente/Ahorros</option>
              <option value="nequi">Nequi</option>
              <option value="bancolombia">Bancolombia a la Mano</option>
            </select>
          </div>

          {/* Total a pagar */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Total a pagar:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(obtenerMonto())}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Método: {normalizarMetodoPago(metodoPago)}</span>
              <span>Monto mínimo: $1,000</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handlePagar}
              disabled={loading || obtenerMonto() < 1000}
              className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>💳 Pagar con {normalizarMetodoPago(metodoPago)}</>
              )}
            </button>
          </div>

          {/* Nota de seguridad */}
          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Tu información está protegida. Serás redirigido a PayValida para completar el pago de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}