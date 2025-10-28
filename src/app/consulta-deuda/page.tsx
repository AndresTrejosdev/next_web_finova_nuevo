"use client";

import { useState } from 'react';
import axios from 'axios';
import ModalPago from '../Components/ModalPago/ModalPago';
// CSS cargado via <link> en layout.tsx desde /public/assets/css/consulta-deuda.css

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
  telefono?: string;
  ciudad?: string;
  amortizacion?: any[];
  valor_prestamo: number;
  plazo: number;
  numero_cuotas: number;
  valor_cuota: number;
  tasa_interes: number;
  fecha_inicio: string;
  fecha_fin: string;
  saldo_pendiente: number;
  cuotas_pagadas: number;
  cuotas_pendientes: number;
  proxima_cuota: string;
  dias_mora: number;
  valor_mora: number;
  valor_sancion: number;
  total_pagado: number;
  interes_pagado: number;
  capital_pagado: number;
  periodicidad: string;
  tipo_amortizacion: string;
  garantia: string;
  observaciones: string;
  fecha_creacion: string;
  periocidad?: string;
  tasa?: number;
  fecha_Pago?: string;
  origen?: string;
  [key: string]: any;
}

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

      const creditosEnCurso = response.data.filter(
        (credito: Credito) => credito.estado === 'EN CURSO'
      );

      setCreditos(creditosEnCurso);
      
      if (creditosEnCurso.length === 0) {
        setError('No se encontraron créditos activos (EN CURSO) para esta cédula');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al consultar los créditos');
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
            placeholder="Ejemplo: 1088282985"
            maxLength={15}
            onKeyPress={(e) => e.key === 'Enter' && handleConsultar()}
          />
        </div>

        {error && (
          <div className="consulta-error">{error}</div>
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
                    <p className="monto-value">${credito.pagoMinimo?.toLocaleString()}</p>
                  </div>
                  
                  <div className="monto-box monto-total">
                    <p className="monto-label">Pago Total</p>
                    <p className="monto-value">${credito.pagoTotal?.toLocaleString()}</p>
                  </div>

                  {credito.pagoEnMora > 0 && (
                    <div className="monto-box monto-mora">
                      <p className="monto-label">Pago en Mora</p>
                      <p className="monto-value">${credito.pagoEnMora?.toLocaleString()}</p>
                      <div className="alerta-mora">
                        ⚠️ Tienes pagos pendientes en mora
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
                              <tr key={index} className={cuota.estado === 'PAGADA' ? 'fila-pagada' : ''}>
                                <td>{index + 1}</td>
                                <td>{new Date(cuota.fecha).toLocaleDateString('es-CO')}</td>
                                <td>${cuota.valorCuota?.toLocaleString()}</td>
                                <td className={cuota.mora > 0 ? 'mora-activa' : ''}>
                                  ${cuota.mora?.toLocaleString()}
                                </td>
                                <td>${cuota.sancion?.toLocaleString() || '0'}</td>
                                <td>
                                  <span className={`estado-badge ${cuota.estado.toLowerCase()}`}>
                                    {cuota.estado}
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
                  💳 Pagar Cuota
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
