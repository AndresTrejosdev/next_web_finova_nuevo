"use client";

import { useState } from 'react';
import axios from 'axios';
import type { Credito, PayValidaRequest, PayValidaResponse } from '@/lib/types';

  interface ModalPagoProps {
    credito: Credito;
    onClose: () => void;
  }

  // Métodos de pago disponibles
  const metodosPago = [
    { value: 'pse', label: 'PSE', icon: '🏦' },
    { value: 'nequi', label: 'Nequi', icon: '💜' },
    { value: '.ref', label: 'Referenciado', icon: '📄' },
    { value: 'daviplata', label: 'Daviplata', icon: '🔴' },
    { value: 'bancolombia', label: 'Bancolombia', icon: '🟡' }
  ];

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

    // Función para generar ordenId dinámico
    const generarOrdenId = (prestamoId: number, metodoPago: string): string => {
      const fecha = new Date();
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const dia = fecha.getDate().toString().padStart(2, '0');
      
      // Generar código único según método de pago
      let codigoMetodo = '';
      switch(metodoPago) {
        case 'pse':
          codigoMetodo = Math.floor(Math.random() * 900000 + 100000).toString();
          break;
        case 'nequi':
          codigoMetodo = Math.floor(Math.random() * 900000 + 100000).toString();
          break;
        case '.ref':
          codigoMetodo = Math.floor(Math.random() * 900000 + 100000).toString();
          break;
        case 'daviplata':
          codigoMetodo = Math.floor(Math.random() * 900000 + 100000).toString();
          break;
        case 'bancolombia':
          codigoMetodo = Math.floor(Math.random() * 900000 + 100000).toString();
          break;
        default:
          codigoMetodo = Math.floor(Math.random() * 900000 + 100000).toString();
      }
      
      return `${prestamoId}T${mes}${dia}${codigoMetodo}`;
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
      const monto = obtenerMonto();

      if (monto < 1000) {
        alert('El monto mínimo es de $1,000');
        return;
      }

      if (tipoPago === 'otro_valor' && !otroValor) {
        alert('Por favor ingresa un monto');
        return;
      }

      setLoading(true);

      try {
        // Generar ordenId dinámico basado en método de pago
        const ordenId = generarOrdenId(credito.prestamo_ID, metodoPago);

        console.log('🔵 Generando pago:', {
          ordenId,
          metodoPago,
          monto,
          prestamoId: credito.prestamo_ID
        });

        const response = await axios.post('/api/payvalida', {
          nombreCliente: credito.nombreCompleto || 'Cliente Finova',
          email: credito.email || 'cliente@finova.com.co',
          amount: monto,
          identification: credito.documento,
          identificationType: 'CC',
          metodoPago: metodoPago,
          ordenId: ordenId,
          prestamoId: credito.prestamo_ID
        });

        console.log('✅ Respuesta PayValida:', response.data);

        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error('No se recibió URL de pago');
        }
      } catch (error: any) {
        console.error('❌ Error al procesar el pago:', error);
        alert(error.response?.data?.error || 'Error al procesar el pago. Intenta de nuevo.');
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
              <p className="text-red-800 text-sm font-medium"> {error}</p>
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
              {/* Pago Mínimo */}
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="tipoPago"
                  value="pago_minimo"
                  checked={tipoPago === 'pago_minimo'}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <span className="font-medium">Pago Mínimo</span>
                  <span className="float-right text-blue-600 font-bold">
                    ${credito.pagoMinimo?.toLocaleString()}
                  </span>
                </div>
              </label>

              {/* Pago Total */}
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="tipoPago"
                  value="pago_total"
                  checked={tipoPago === 'pago_total'}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <span className="font-medium">Pago Total</span>
                  <span className="float-right text-green-600 font-bold">
                    ${credito.pagoTotal?.toLocaleString()}
                  </span>
                </div>
              </label>

              {/* Pago en Mora - SOLO si hay mora */}
              {credito.pagoEnMora > 0 && (
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="tipoPago"
                    value="pago_mora"
                    checked={tipoPago === 'pago_mora'}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Pago en Mora</span>
                    <span className="float-right text-red-600 font-bold">
                      ${credito.pagoEnMora?.toLocaleString()}
                    </span>
                  </div>
                </label>
              )}
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {metodosPago.map((metodo) => (
                <option key={metodo.value} value={metodo.value}>
                  {metodo.icon} {metodo.label}
                </option>
              ))}
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
                <>Pagar con {normalizarMetodoPago(metodoPago)}</>
              )}
            </button>
          </div>

          {/* Nota de seguridad */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Tu información está protegida. Serás redirigido a PayValida para completar el pago de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}