"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

interface Credito {
  prestamo_ID: number;
  tipoCredito: string;
  estado: string;
  pagoMinimo: number;
  pagoTotal: number;
  pagoEnMora: number;
  documento: string;
  nombreCompleto?: string;
  email?: string;
  [key: string]: any;
}

interface ModalPagoProps {
  credito: Credito;
  onClose: () => void;
}

const metodosPago = [
  { value: 'PSE', label: 'PSE' },
  { value: 'nequi', label: 'Nequi' },
  { value: 'efecty', label: 'Efecty' },
  { value: 'daviplata', label: 'Daviplata' },
  { value: 'bancolombia', label: 'Bancolombia' }
];

function ModalPagoContent({ credito, onClose }: ModalPagoProps) {
  const [tipoPago, setTipoPago] = useState('minimo');
  const [loading, setLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState('PSE');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const obtenerMonto = () => {
    switch (tipoPago) {
      case 'minimo':
        return credito.pagoMinimo;
      case 'total':
        return credito.pagoTotal;
      case 'mora':
        return credito.pagoEnMora;
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

  const getNombreMetodo = (metodo: string): string => {
    const metodosMap: { [key: string]: string } = {
      'PSE': 'PSE',
      'nequi': 'Nequi',
      'efecty': 'Efecty',
      'daviplata': 'Daviplata',
      'bancolombia': 'Bancolombia'
    };
    return metodosMap[metodo] || metodo.toUpperCase();
  };

  const handlePagar = async () => {
    const monto = obtenerMonto();

    if (monto < 1000) {
      setError('El monto mínimo es de $1,000');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Enviando solicitud de pago:', {
        prestamo_ID: credito.prestamo_ID,
        cedula: credito.documento,
        monto: monto,
        tipoPago: tipoPago,
        metodoPago: metodoPago
      });

      const response = await axios.post('/api/payvalida/iniciar-pago', {
        prestamo_ID: credito.prestamo_ID,
        cedula: credito.documento,
        monto: monto,
        tipoPago: tipoPago,
        metodoPago: metodoPago
      });

      console.log('Respuesta recibida:', response.data);

      if (response.data.success && response.data.urlPago) {
        console.log('Redirigiendo a:', response.data.urlPago);
        window.location.href = response.data.urlPago;
      } else {
        throw new Error(response.data.error || 'No se recibió URL de pago');
      }
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      const mensajeError = error.response?.data?.error || error.message || 'Error al procesar el pago';
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay-fixed"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(18, 39, 75, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
    >
      <div 
        className="modal-content-container"
        style={{
          backgroundColor: 'white',
          borderRadius: '32px',
          maxWidth: '42rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(18, 39, 75, 0.4)'
        }}
      >
        <div style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#12274B' }}>Realizar Pago</h2>
            <button
              onClick={onClose}
              style={{
                color: '#6b7280',
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                fontWeight: 'bold'
              }}
              aria-label="Cerrar modal"
            >
              &times;
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '0 12px 12px 0'
            }}>
              <p style={{ color: '#991b1b', fontSize: '0.875rem', fontWeight: '600' }}>{error}</p>
            </div>
          )}

          {/* Info del crédito */}
          <div style={{
            backgroundColor: '#D0EDFC',
            padding: '1.5rem',
            borderRadius: '16px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontWeight: '800', marginBottom: '0.5rem', color: '#12274B', fontSize: '1.25rem' }}>
              {credito.tipoCredito}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#1468B1', fontWeight: '600' }}>
              Préstamo #{credito.prestamo_ID}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#2A7ABF', fontWeight: '600' }}>
              Documento: {credito.documento}
            </p>
          </div>

          {/* Tipo de pago */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#12274B', 
              marginBottom: '1rem' 
            }}>
              Selecciona el tipo de pago
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Pago Mínimo */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: `2px solid ${tipoPago === 'minimo' ? '#1468B1' : '#D0EDFC'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                backgroundColor: tipoPago === 'minimo' ? '#D0EDFC' : 'white',
                transition: 'all 0.3s'
              }}>
                <input
                  type="radio"
                  name="tipoPago"
                  value="minimo"
                  checked={tipoPago === 'minimo'}
                  onChange={(e) => setTipoPago(e.target.value)}
                  style={{ marginRight: '1rem', width: '20px', height: '20px' }}
                />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#12274B' }}>Pago Mínimo</span>
                  <span style={{ color: '#1468B1', fontWeight: '800', fontSize: '1.25rem' }}>
                    ${credito.pagoMinimo?.toLocaleString()}
                  </span>
                </div>
              </label>

              {/* Pago Total */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: `2px solid ${tipoPago === 'total' ? '#1468B1' : '#D0EDFC'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                backgroundColor: tipoPago === 'total' ? '#D0EDFC' : 'white',
                transition: 'all 0.3s'
              }}>
                <input
                  type="radio"
                  name="tipoPago"
                  value="total"
                  checked={tipoPago === 'total'}
                  onChange={(e) => setTipoPago(e.target.value)}
                  style={{ marginRight: '1rem', width: '20px', height: '20px' }}
                />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#12274B' }}>Pago Total</span>
                  <span style={{ color: '#10b981', fontWeight: '800', fontSize: '1.25rem' }}>
                    ${credito.pagoTotal?.toLocaleString()}
                  </span>
                </div>
              </label>

              {/* Pago en Mora */}
              {credito.pagoEnMora > 0 && (
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: `2px solid ${tipoPago === 'mora' ? '#f59e0b' : '#D0EDFC'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  backgroundColor: tipoPago === 'mora' ? '#fef3c7' : 'white',
                  transition: 'all 0.3s'
                }}>
                  <input
                    type="radio"
                    name="tipoPago"
                    value="mora"
                    checked={tipoPago === 'mora'}
                    onChange={(e) => setTipoPago(e.target.value)}
                    style={{ marginRight: '1rem', width: '20px', height: '20px' }}
                  />
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#12274B' }}>Pago en Mora</span>
                    <span style={{ color: '#dc2626', fontWeight: '800', fontSize: '1.25rem' }}>
                      ${credito.pagoEnMora?.toLocaleString()}
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Método de pago */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#12274B', 
              marginBottom: '1rem' 
            }}>
              Método de pago
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid #D0EDFC',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#12274B',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              {metodosPago.map((metodo) => (
                <option key={metodo.value} value={metodo.value}>
                  {metodo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Resumen */}
          <div style={{
            background: 'linear-gradient(135deg, #D0EDFC 0%, #fff 100%)',
            padding: '1.5rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            border: '2px solid #1468B1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: '600', color: '#12274B', fontSize: '1.125rem' }}>Total a pagar:</span>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#1468B1' }}>
                {formatCurrency(obtenerMonto())}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#2A7ABF', fontWeight: '600' }}>
              <span>Método: {getNombreMetodo(metodoPago)}</span>
              <span>Monto mínimo: $1,000</span>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem',
                border: '2px solid #D0EDFC',
                borderRadius: '16px',
                fontWeight: '600',
                fontSize: '1rem',
                backgroundColor: 'white',
                color: '#12274B',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.3s'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handlePagar}
              disabled={loading || obtenerMonto() < 1000}
              style={{
                flex: 1,
                padding: '1rem',
                background: loading || obtenerMonto() < 1000 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem',
                borderRadius: '16px',
                border: 'none',
                cursor: loading || obtenerMonto() < 1000 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Procesando...' : `Pagar con ${getNombreMetodo(metodoPago)}`}
            </button>
          </div>

          {/* Nota de seguridad */}
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#2A7ABF', 
            textAlign: 'center', 
            marginTop: '1.5rem',
            fontWeight: '600'
          }}>
            🔒 Tu información está protegida. Serás redirigido a PayValida para completar el pago de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ModalPago({ credito, onClose }: ModalPagoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <ModalPagoContent credito={credito} onClose={onClose} />,
    document.body
  );
}
