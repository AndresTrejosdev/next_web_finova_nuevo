"use client";

import { useState } from 'react';
import axios from 'axios';
import type { Credito } from '@/lib/types';

interface ModalPagoProps {
  credito: Credito;
  onClose: () => void;
}

// Métodos de pago disponibles
const metodosPagoBase = [
  { value: 'pse', label: 'PSE', gopagos: false },
  { value: 'nequi', label: 'Nequi', gopagos: false },
  { value: '.ref', label: 'Referenciado', gopagos: false },
  { value: 'daviplata', label: 'Daviplata', gopagos: false },
  { value: 'bancolombia', label: 'Bancolombia', gopagos: false },
  { value: 'puntored', label: 'PuntoRed', gopagos: true } // Solo GoPagos
];

// Constantes
const MONTO_MINIMO = 1000;

export default function ModalPago({ credito, onClose }: ModalPagoProps) {
  const [tipoPago, setTipoPago] = useState('pago_minimo');
  const [otroValor, setOtroValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState('pse');
  const [error, setError] = useState<string | null>(null);
  const [emailUsuario, setEmailUsuario] = useState(credito.email || '');
  const [nombreUsuario, setNombreUsuario] = useState(credito.nombreCompleto || '');

  // Determinar métodos disponibles según tipo de crédito
  const metodosPagoDisponibles = credito.amortizacion 
    ? metodosPagoBase // Todos los métodos incluyendo PuntoRed
    : metodosPagoBase.filter(m => m.value !== 'puntored'); // Sin PuntoRed

  /**
   * Obtiene el monto a pagar según el tipo seleccionado
   */
  const obtenerMonto = (): number => {
    switch (tipoPago) {
      case 'pago_minimo':
        return credito.pagoMinimo || 0;
      case 'pago_total':
        return credito.pagoTotal || 0;
      case 'pago_mora':
        return credito.pagoEnMora || 0;
      case 'otro_valor':
        const valor = Number(otroValor);
        return isNaN(valor) ? 0 : valor;
      default:
        return 0;
    }
  };

  /**
   * Formatea un número a formato de moneda colombiana
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  /**
   * Genera un ID único para la orden de pago
   */
  const generarOrdenId = (prestamoId: number, metodoPago: string): string => {
    const fecha = new Date();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const codigoMetodo = Math.floor(Math.random() * 900000 + 100000).toString();
    return `${prestamoId}T${mes}${dia}${codigoMetodo}`;
  };

  /**
   * Normaliza el método de pago a su etiqueta legible
   */
  const normalizarMetodoPago = (metodo: string): string => {
    const metodoSeleccionado = metodosPagoDisponibles.find(m => m.value === metodo);
    return metodoSeleccionado?.label || 'PSE';
  };

  /**
   * Verifica si el método de pago es de GoPagos
   */
  const esMetodoGoPagos = (metodo: string): boolean => {
    const metodoObj = metodosPagoDisponibles.find(m => m.value === metodo);
    return metodoObj?.gopagos || false;
  };

  /**
   * Valida los datos del formulario antes de procesar el pago
   */
  const validarFormulario = (monto: number): string | null => {
    // Validar nombre
    if (!nombreUsuario.trim()) {
      return 'Por favor ingresa tu nombre completo';
    }

    if (nombreUsuario.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailUsuario.trim() || !emailRegex.test(emailUsuario)) {
      return 'Por favor ingresa un email válido';
    }

    // Validar monto
    if (monto < MONTO_MINIMO) {
      return `El monto mínimo es de ${formatCurrency(MONTO_MINIMO)}`;
    }

    // Validar otro valor si está seleccionado
    if (tipoPago === 'otro_valor' && !otroValor) {
      return 'Por favor ingresa un monto';
    }

    if (tipoPago === 'otro_valor' && isNaN(Number(otroValor))) {
      return 'El monto ingresado no es válido';
    }

    return null;
  };

  /**
   * Maneja el proceso de pago
   */
  const handlePagar = async () => {
    const monto = obtenerMonto();

    // Validar formulario
    const errorValidacion = validarFormulario(monto);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const ordenId = generarOrdenId(credito.prestamo_ID, metodoPago);
      const usaGoPagos = esMetodoGoPagos(metodoPago);

      console.log('🔵 Iniciando pago con datos:', {
        ordenId,
        metodoPago: normalizarMetodoPago(metodoPago),
        monto: formatCurrency(monto),
        prestamoId: credito.prestamo_ID,
        nombre: nombreUsuario,
        email: emailUsuario,
        documento: credito.documento,
        gopagos: usaGoPagos,
        tipoCredito: credito.tipoCredito
      });

      // Determinar endpoint según método de pago
      const endpoint = usaGoPagos 
        ? '/api/gopagos'    // Endpoint para PuntoRed → GoPagos
        : '/api/payvalida'; // Endpoint para otros métodos → PayValida

      const payload = {
        nombreCliente: nombreUsuario.trim(),
        email: emailUsuario.trim().toLowerCase(),
        amount: monto,
        identification: credito.documento,
        identificationType: 'CC',
        metodoPago: metodoPago,
        ordenId: ordenId,
        prestamoId: credito.prestamo_ID,
        tipoPago: tipoPago
      };

      const response = await axios.post(endpoint, payload, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Respuesta de API:', response.data);

      if (response.data.url) {
        // Redirigir a la URL de pago
        window.location.href = response.data.url;
      } else {
        throw new Error(`No se recibió URL de pago de ${usaGoPagos ? 'GoPagos' : 'PayValida'}`);
      }
    } catch (error: any) {
      console.error('❌ Error al procesar el pago:', error);
      
      let mensajeError = 'Error al procesar el pago. Intenta de nuevo.';
      
      if (error.code === 'ECONNABORTED') {
        mensajeError = 'Tiempo de espera agotado. Verifica tu conexión e intenta nuevamente.';
      } else if (error.response?.data?.error) {
        mensajeError = error.response.data.error;
      } else if (error.message) {
        mensajeError = error.message;
      }
      
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Determina si el botón de pago debe estar deshabilitado
   */
  const isPagarDisabled = (): boolean => {
    return loading || obtenerMonto() < MONTO_MINIMO || !nombreUsuario.trim() || !emailUsuario.trim();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div>
              <h2 className="modal-title">Realizar Pago</h2>
              <p className="modal-subtitle">Completa la información para procesar tu pago</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Cerrar modal"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Error global */}
          {error && (
            <div className="modal-error" role="alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Información del crédito */}
          <div className="credito-info-box">
            <div className="credito-info-header">
              <div>
                <h3>{credito.tipoCredito}</h3>
                <p>Préstamo #{credito.prestamo_ID}</p>
              </div>
            </div>
            <div className="credito-info-badge">
              <span>Documento: {credito.documento}</span>
            </div>
          </div>

          {/* Datos del usuario */}
          <div className="form-section">
            <h4 className="section-title">Información del Titular</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">
                  Nombre Completo *
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  className="form-input"
                  required
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={emailUsuario}
                  onChange={(e) => setEmailUsuario(e.target.value)}
                  placeholder="tu@email.com"
                  className="form-input"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>
          </div>

          {/* Tipo de pago */}
          <div className="form-section">
            <h4 className="section-title">Selecciona el Tipo de Pago</h4>
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
                  disabled={loading}
                />
                <div className="payment-option-content">
                  <div className="payment-option-info">
                    <span className="payment-option-label">Pago Mínimo</span>
                    <span className="payment-option-desc">Mantén tu crédito al día</span>
                  </div>
                  <span className="payment-option-amount">
                    {formatCurrency(credito.pagoMinimo || 0)}
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
                  disabled={loading}
                />
                <div className="payment-option-content">
                  <div className="payment-option-info">
                    <span className="payment-option-label">Pago Total</span>
                    <span className="payment-option-desc">Liquida completamente</span>
                  </div>
                  <span className="payment-option-amount total">
                    {formatCurrency(credito.pagoTotal || 0)}
                  </span>
                </div>
              </label>

              {/* Pago en Mora - SOLO si hay mora > 0 */}
              {credito.pagoEnMora > 0 && (
                <label className={`payment-option mora ${tipoPago === 'pago_mora' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="tipoPago"
                    value="pago_mora"
                    checked={tipoPago === 'pago_mora'}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className="payment-radio"
                    disabled={loading}
                  />
                  <div className="payment-option-content">
                    <div className="payment-option-info">
                      <span className="payment-option-label">Pago de Mora</span>
                      <span className="payment-option-desc">Pago urgente - Solo cuotas vencidas</span>
                    </div>
                    <span className="payment-option-amount mora">
                      {formatCurrency(credito.pagoEnMora)}
                    </span>
                  </div>
                </label>
              )}

              {/* Otro Valor - Solo para amortización */}
              {credito.amortizacion && (
                <label className={`payment-option ${tipoPago === 'otro_valor' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="tipoPago"
                    value="otro_valor"
                    checked={tipoPago === 'otro_valor'}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className="payment-radio"
                    disabled={loading}
                  />
                  <div className="payment-option-content">
                    <div className="payment-option-info">
                      <span className="payment-option-label">Otro Valor</span>
                      <span className="payment-option-desc">Ingresa el monto que deseas pagar</span>
                    </div>
                    {tipoPago === 'otro_valor' && (
                      <input
                        type="number"
                        value={otroValor}
                        onChange={(e) => setOtroValor(e.target.value)}
                        placeholder="Monto"
                        className="form-input"
                        min={MONTO_MINIMO}
                        disabled={loading}
                        style={{ maxWidth: '150px' }}
                      />
                    )}
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Método de pago */}
          <div className="form-section">
            <h4 className="section-title">Método de Pago</h4>
            <div className="payment-methods">
              {metodosPagoDisponibles.map((metodo) => (
                <label
                  key={metodo.value}
                  className={`payment-method ${metodoPago === metodo.value ? 'active' : ''} ${metodo.gopagos ? 'gopagos' : ''}`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value={metodo.value}
                    checked={metodoPago === metodo.value}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="payment-method-radio"
                    disabled={loading}
                  />
                  <div className="payment-method-content">
                    <span className="payment-method-label">{metodo.label}</span>
                    {metodo.gopagos && (
                      <span className="payment-method-badge">GoPagos</span>
                    )}
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
                <span>Método: {normalizarMetodoPago(metodoPago)}</span>
              </div>
              <div className="total-info-item">
                <span>Monto mínimo: {formatCurrency(MONTO_MINIMO)}</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="modal-actions">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={handlePagar}
              disabled={isPagarDisabled()}
              className="btn-primary"
              type="button"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Procesando...
                </>
              ) : (
                <>Pagar con {normalizarMetodoPago(metodoPago)}</>
              )}
            </button>
          </div>

          {/* Nota de seguridad */}
          <div className="security-note">
            <p>
              🔒 Tu información está protegida. Serás redirigido a{' '}
              <strong>{esMetodoGoPagos(metodoPago) ? 'GoPagos' : 'PayValida'}</strong>{' '}
              para completar el pago de forma segura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}