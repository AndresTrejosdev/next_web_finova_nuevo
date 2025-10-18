"use client";

import { useState } from 'react';
import axios from 'axios';
import type { Credito } from '@/lib/types';
import ModalPago from '../Components/ModalPago';

export default function ConsultaDeuda() {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [creditos, setCreditos] = useState<Credito[]>([]);
  const [error, setError] = useState('');
  const [creditoSeleccionado, setCreditoSeleccionado] = useState<Credito | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tablaVisible, setTablaVisible] = useState<{[key: number]: boolean}>({});

  const handleConsultar = async () => {
    if (!cedula || cedula.length < 6) {
      setError('Por favor ingresa una cédula válida');
      return;
    }

    setLoading(true);
    setError('');
    setCreditos([]);

    try {
      const response = await axios.post('/api/credito', {
        userDocumento: cedula
      });

      // Manejar diferentes tipos de respuesta de la API
      if (response.data.creditos !== undefined) {
        // Respuesta con metadata (casos especiales)
        const { creditos, error, message, metadata, creditosInactivos } = response.data;
        
        setCreditos(creditos);
        
        if (error === 'NO_CREDITS_FOUND') {
          setError(`❌ ${message}`);
        } else if (error === 'NO_ACTIVE_CREDITS') {
          // Mensaje más informativo para créditos inactivos
          let mensajeDetallado = `⚠️ ${message}`;
          
          if (creditosInactivos && creditosInactivos.length > 0) {
            mensajeDetallado += '\n\nCréditos encontrados (inactivos):';
            creditosInactivos.forEach((c: any) => {
              mensajeDetallado += `\n• Préstamo #${c.prestamo_ID} - ${c.tipoCredito} (${c.estado})`;
            });
            mensajeDetallado += '\n\nPara más información sobre estos créditos, contacta a soporte.';
          }
          
          setError(mensajeDetallado);
        }
        
        console.log('📊 Metadata de consulta:', metadata);
      } else {
        // Respuesta directa con array de créditos (caso exitoso normal)
        const creditosEnCurso = Array.isArray(response.data) 
          ? response.data.filter((credito: Credito) => credito.estado === 'EN CURSO')
          : [];
        
        setCreditos(creditosEnCurso);
        
        if (creditosEnCurso.length === 0) {
          setError('No se encontraron créditos activos (EN CURSO) para esta cédula');
        }
      }
    } catch (err: any) {
      console.error('❌ Error al consultar créditos:', err);
      
      // Manejo específico de errores de la API
      if (err.response?.status === 404) {
        setError('❌ No se encontraron créditos para este documento. Verifica que el número de cédula sea correcto.');
      } else if (err.response?.status === 504) {
        setError('⏱️ Tiempo de espera agotado. Los servicios están experimentando alta demanda. Intenta nuevamente en unos minutos.');
      } else if (err.response?.status === 503) {
        setError('🔌 Error de conectividad. Verifica tu conexión a internet e intenta nuevamente.');
      } else {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al consultar los créditos';
        setError(`❌ ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTabla = (prestamoId: number) => {
    setTablaVisible(prev => ({
      ...prev,
      [prestamoId]: !prev[prestamoId]
    }));
  };

  const getBadgeClass = (estado: string) => {
    return 'credito-badge badge-en-curso';
  };

  return (
    <div className="consulta-deuda-container">
      <div className="consulta-deuda-card">
        <h1 className="consulta-deuda-title">Consulta tu Crédito</h1>
        <p className="consulta-deuda-subtitle">
          Ingresa tu cédula para ver tus créditos activos
        </p>

        <div className="consulta-form-group">
          <label className="consulta-label">Número de Cédula</label>
          <input
            className="consulta-input"
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
            placeholder="Ingrese su cédula"
            maxLength={15}
            onKeyPress={(e) => e.key === 'Enter' && handleConsultar()}
          />
        </div>

        {error && (
          <div className="consulta-error">
            {error.split('\n').map((linea, index) => (
              <div key={index} style={{ marginBottom: index < error.split('\n').length - 1 ? '8px' : '0' }}>
                {linea}
              </div>
            ))}
          </div>
        )}

        <div className="consulta-btn-container">
          <button
            className="consulta-btn-primary"
            onClick={handleConsultar}
            disabled={loading}
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>

        {loading && (
          <div className="consulta-loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Consultando créditos activos...</p>
          </div>
        )}

        {creditos.length > 0 && (
          <div className="creditos-grid">
            <div className="creditos-info-header">
              <p>Se encontraron <strong>{creditos.length}</strong> crédito(s) activo(s)</p>
            </div>

            {creditos.map((credito) => (
              <div key={credito.prestamo_ID} className="credito-card">
                <div className="credito-header">
                  <div className="credito-info">
                    <h3>{credito.tipoCredito}</h3>
                    <p className="credito-id">Préstamo #{credito.prestamo_ID}</p>
                  </div>
                  <span className={getBadgeClass(credito.estado)}>
                    {credito.estado}
                  </span>
                </div>

                <div className="montos-grid">
                  <div className="monto-box monto-minimo">
                    <p className="monto-label">Pago Mínimo</p>
                    <p className="monto-value">${credito.pagoMinimo?.toLocaleString() || '0'}</p>
                  </div>
                  
                  <div className="monto-box monto-total">
                    <p className="monto-label">Pago Total</p>
                    <p className="monto-value">${credito.pagoTotal?.toLocaleString() || '0'}</p>
                  </div>

                  {credito.pagoEnMora > 0 && (
                    <div className="monto-box monto-mora">
                      <p className="monto-label">Pago en Mora</p>
                      <p className="monto-value">${credito.pagoEnMora?.toLocaleString() || '0'}</p>
                      <div className="alerta-mora">
                        Tienes pagos pendientes en mora
                      </div>
                    </div>
                  )}
                </div>

                {credito.amortizacion && credito.amortizacion.length > 0 && (
                  <div className="tabla-amortizacion-container">
                    <button
                      className="btn-ver-tabla"
                      onClick={() => toggleTabla(credito.prestamo_ID)}
                    >
                      {tablaVisible[credito.prestamo_ID] ? '▼ Ocultar' : '▶ Ver'} Detalle de Cuotas
                    </button>

                    {tablaVisible[credito.prestamo_ID] && (
                      <div className="tabla-wrapper">
                        <table className="tabla-amortizacion">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Fecha</th>
                              <th>Cuota</th>
                              <th>Mora</th>
                              <th>Sanción</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {credito.amortizacion.map((cuota: any, index: number) => (
                              <tr 
                                key={`${credito.prestamo_ID}-${index}`} 
                                className={cuota.estado === 'PAGADA' ? 'fila-pagada' : ''}
                              >
                                <td>{index + 1}</td>
                                <td>
                                  {cuota.fecha 
                                    ? new Date(cuota.fecha).toLocaleDateString('es-CO')
                                    : 'N/A'}
                                </td>
                                <td>${cuota.valorCuota?.toLocaleString() || '0'}</td>
                                <td className={(cuota.mora || 0) > 0 ? 'mora-activa' : ''}>
                                  ${cuota.mora?.toLocaleString() || '0'}
                                </td>
                                <td>${cuota.sancion?.toLocaleString() || '0'}</td>
                                <td>
                                  <span className={`estado-badge ${(cuota.estado || 'pendiente').toLowerCase()}`}>
                                    {cuota.estado || 'PENDIENTE'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                <button
                  className="btn-pagar-pse"
                  onClick={() => {
                    setCreditoSeleccionado(credito);
                    setMostrarModal(true);
                  }}
                >
                  Pagar Cuota
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarModal && creditoSeleccionado && (
        <ModalPago
          credito={creditoSeleccionado}
          onClose={() => {
            setMostrarModal(false);
            setCreditoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
}
