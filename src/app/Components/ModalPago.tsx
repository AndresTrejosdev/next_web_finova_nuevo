"use client";

import { useState } from 'react';
import axios from 'axios';
import type { Credito, PayValidaRequest, PayValidaResponse } from '@/lib/types';

interface ModalPagoProps {
  credito: Credito;
  onClose: () => void;
}

// Métodos de pago disponibles con iconos
const metodosPago = [
  { value: 'pse', label: 'PSE', icon: '🏦', color: '#1468B1' },
  { value: 'nequi', label: 'Nequi', icon: '💜', color: '#8B2F97' },
  { value: '.ref', label: 'Referenciado', icon: '📄', color: '#12274B' },
  { value: 'daviplata', label: 'Daviplata', icon: '🔴', color: '#ED1C24' },
  { value: 'bancolombia', label: 'Bancolombia', icon: '🟡', color: '#FDDA24' }
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

  const generarOrdenId = (prestamoId: number, metodoPago: string): string => {
    const fecha = new Date();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const codigoMetodo = Math.floor(Math.random() * 900000 + 100000).toString();
    return `${prestamoId}T${mes}${dia}${codigoMetodo}`;
  };

  const normalizarMetodoPago = (metodo: string): string => {
    const metodoSeleccionado = metodosPago.find(m => m.value === metodo);
    return metodoSeleccionado?.label || 'PSE';
  };

  const handlePagar = async () => {
    const monto = obtenerMonto();

    if (!nombreUsuario.trim()) {
      setError('Por favor ingresa tu nombre completo');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailUsuario.trim() || !emailRegex.test(emailUsuario)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (monto < 1000) {
      setError('El monto mínimo es de $1,000');
      return;
    }

    if (tipoPago === 'otro_valor' && !otroValor) {
      setError('Por favor ingresa un monto');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const ordenId = generarOrdenId(credito.prestamo_ID, metodoPago);

      console.log('🔵 Iniciando pago con datos:', {
        ordenId,
        metodoPago,
        monto,
        prestamoId: credito.prestamo_ID,
        nombre: nombreUsuario,
        email: emailUsuario
      });

      const response = await axios.post('/api/payvalida', {
        nombreCliente: nombreUsuario,
        email: emailUsuario,
        amount: monto,
        identification: credito.documento,
        identificationType: 'CC',
        metodoPago: metodoPago,
        ordenId: ordenId,
        prestamoId: credito.prestamo_ID
      });

      console.log('✅ Respuesta de API:', response.data);

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (error: any) {
      console.error('❌ Error al procesar el pago:', error);
      setError(error.response?.data?.error || 'Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header del modal */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">💳</div>
            <div>
              <h2 className="modal-title">Realizar Pago</h2>
              <p className="modal-subtitle">Completa la información para procesar tu pago</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Error global */}
          {error && (
            <div className="modal-error">
              <span className="modal-error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Información del crédito */}
          <div className="credito-info-box">
            <div className="credito-info-header">
              <span className="credito-info-icon">📋</span>
              <div>
                <h3>{credito.tipoCredito}</h3>
                <p>Préstamo #{credito.prestamo_ID}</p>
              </div>
            </div>
            <div className="credito-info-badge">
              <span>CC: {credito.documento}</span>
            </div>
          </div>

          {/* Datos del usuario */}
          <div className="form-section">
            <h4 className="section-title">
              <span className="section-icon">👤</span>
              Información del Titular
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre Completo *</label>
                <input
                  type="text"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  value={emailUsuario}
                  onChange={(e) => setEmailUsuario(e.target.value)}
                  placeholder="tu@email.com"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tipo de pago */}
          <div className="form-section">
            <h4 className="section-title">
              <span className="section-icon">💰</span>
              Selecciona el Tipo de Pago
            </h4>
            <div className="payment-options">
              {/* Pago Mínimo */}
              <label className={`payment-option ${tipoPago === 'pago_minimo' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="tipoPago"
                  value="pago_minimo"
                  checked={tipoPago === 'pago_minimo'}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="payment-radio"
                />
                <div className="payment-option-content">
                  <span className="payment-option-icon">💵</span>
                  <div className="payment-option-info">
                    <span className="payment-option-label">Pago Mínimo</span>
                    <span className="payment-option-desc">Mantén tu crédito al día</span>
                  </div>
                  <span className="payment-option-amount">
                    ${credito.pagoMinimo?.toLocaleString()}
                  </span>
                </div>
              </label>

              {/* Pago Total */}
              <label className={`payment-option ${tipoPago === 'pago_total' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="tipoPago"
                  value="pago_total"
                  checked={tipoPago === 'pago_total'}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="payment-radio"
                />
                <div className="payment-option-content">
                  <span className="payment-option-icon">✅</span>
                  <div className="payment-option-info">
                    <span className="payment-option-label">Pago Total</span>
                    <span className="payment-option-desc">Liquida completamente</span>
                  </div>
                  <span className="payment-option-amount total">
                    ${credito.pagoTotal?.toLocaleString()}
                  </span>
                </div>
              </label>

              {/* Pago en Mora */}
              {credito.pagoEnMora > 0 && (
                <label className={`payment-option mora ${tipoPago === 'pago_mora' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="tipoPago"
                    value="pago_mora"
                    checked={tipoPago === 'pago_mora'}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className="payment-radio"
                  />
                  <div className="payment-option-content">
                    <span className="payment-option-icon">⚠️</span>
                    <div className="payment-option-info">
                      <span className="payment-option-label">Pago en Mora</span>
                      <span className="payment-option-desc">Pago urgente</span>
                    </div>
                    <span className="payment-option-amount mora">
                      ${credito.pagoEnMora?.toLocaleString()}
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Método de pago */}
          <div className="form-section">
            <h4 className="section-title">
              <span className="section-icon">🏦</span>
              Método de Pago
            </h4>
            <div className="payment-methods">
              {metodosPago.map((metodo) => (
                <label
                  key={metodo.value}
                  className={`payment-method ${metodoPago === metodo.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value={metodo.value}
                    checked={metodoPago === metodo.value}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="payment-method-radio"
                  />
                  <div className="payment-method-content">
                    <span className="payment-method-icon">{metodo.icon}</span>
                    <span className="payment-method-label">{metodo.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Total a pagar */}
          <div className="total-box">
            <div className="total-header">
              <span className="total-label">Total a Pagar</span>
              <span className="total-amount">{formatCurrency(obtenerMonto())}</span>
            </div>
            <div className="total-info">
              <div className="total-info-item">
                <span className="total-info-icon">🏦</span>
                <span>Método: {normalizarMetodoPago(metodoPago)}</span>
              </div>
              <div className="total-info-item">
                <span className="total-info-icon">💵</span>
                <span>Monto mínimo: $1,000</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="modal-actions">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handlePagar}
              disabled={loading || obtenerMonto() < 1000}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <span>🔒</span>
                  Pagar con {normalizarMetodoPago(metodoPago)}
                </>
              )}
            </button>
          </div>

          {/* Nota de seguridad */}
          <div className="security-note">
            <span className="security-icon">🔒</span>
            <p>
              Tu información está protegida. Serás redirigido a <strong>PayValida</strong> para completar el pago de forma segura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
