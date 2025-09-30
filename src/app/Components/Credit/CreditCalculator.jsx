"use client"
import { useState } from 'react';
import FinovaButton from '../Common/FinovaButton';

const CreditCalculator = () => {
  const [amount, setAmount] = useState(180000);
  const [term, setTerm] = useState(2);
  
  // Tasas de Finova
  const interestRate = 0.021; // 2.1% mensual
  const adminRate = 0.049; // 4.9% administrativo mensual

  // Cálculos
  const monthlyPaymentBase = Math.round(
    (amount * interestRate * Math.pow(1 + interestRate, term)) /
    (Math.pow(1 + interestRate, term) - 1)
  );

  const adminFee = Math.round(amount * adminRate);
  const monthlyPayment = monthlyPaymentBase + adminFee;
  const totalPayment = monthlyPayment * term;

  // Formateo de moneda
  const formatCurrency = (value) => {
    return `$${value.toLocaleString("es-CO")}`;
  };

  return (
    <section 
      id="creditos" 
      className="credit-calculator-section section-padding fix" 
      style={{ 
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh'
      }}
    >
      {/* Elementos decorativos animados */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* Círculo superior derecha */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(20, 104, 177, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        
        {/* Círculo inferior izquierda */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(18, 39, 75, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 6s ease-in-out infinite',
            animationDelay: '1s'
          }}
        />
        
        {/* Acento centro derecha */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '-60px',
            transform: 'translateY(-50%)',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(20, 104, 177, 0.05) 0%, transparent 60%)',
            borderRadius: '50%',
            animation: 'pulse 5s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Header mejorado */}
        <div className="text-center mb-5" style={{ paddingBottom: '30px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(20, 104, 177, 0.1) 0%, rgba(20, 104, 177, 0.05) 100%)',
              borderRadius: '20px',
              marginBottom: '24px'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 7H6C4.89543 7 4 7.89543 4 9V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V9C20 7.89543 19.1046 7 18 7H15M9 7V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7M9 7H15M9 12H15M9 16H12" stroke="#1468B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 
            style={{ 
              fontSize: 'clamp(2.5rem, 4vw, 4rem)',
              fontWeight: '700',
              color: '#12274B',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}
          >
            Calcula Tu Crédito
          </h1>
          <p 
            style={{
              fontSize: '1.125rem',
              color: '#ffffff',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            Descubre cuánto puedes pagar mensualmente y planifica tu futuro financiero con nuestra calculadora inteligente
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Calculadora mejorada */}
            <div 
              className="calculator-wrapper" 
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px', 
                padding: '48px',
                boxShadow: '0 20px 60px rgba(18, 39, 75, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden'
              }}
            >
              {/* Header de la calculadora */}
              <div 
                style={{
                  background: 'linear-gradient(90deg, rgba(20, 104, 177, 0.05) 0%, rgba(20, 104, 177, 0.1) 100%)',
                  margin: '-48px -48px 32px -48px',
                  padding: '32px 48px',
                  borderRadius: '24px 24px 0 0'
                }}
              >
                <h3 style={{ 
                  color: '#12274B', 
                  fontWeight: '600', 
                  fontSize: '1.5rem', 
                  margin: 0,
                  textAlign: 'center'
                }}>
                  Configuración del Préstamo
                </h3>
              </div>

              <div className="row" style={{ gap: '32px 0' }}>
                {/* Monto del crédito */}
                <div className="col-lg-6 mb-4">
                  <div className="calculator-input">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <label style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#12274B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="#1468B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Monto del crédito:
                      </label>
                      <span style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        color: '#1468B1',
                        background: 'linear-gradient(135deg, #1468B1 0%, #12274B 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="180000"
                      max="2000000"
                      step="10000"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        height: '12px',
                        borderRadius: '6px',
                        background: 'linear-gradient(to right, #1468B1, #D0EDFC)',
                        outline: 'none',
                        marginBottom: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <div className="d-flex justify-content-between" style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                      <span>$180,000</span>
                      <span>$2,000,000</span>
                    </div>
                  </div>
                </div>

                {/* Plazo */}
                <div className="col-lg-6 mb-4">
                  <div className="calculator-input">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <label style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#12274B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#1468B1" strokeWidth="2"/>
                          <line x1="16" y1="2" x2="16" y2="6" stroke="#1468B1" strokeWidth="2"/>
                          <line x1="8" y1="2" x2="8" y2="6" stroke="#1468B1" strokeWidth="2"/>
                          <line x1="3" y1="10" x2="21" y2="10" stroke="#1468B1" strokeWidth="2"/>
                        </svg>
                        Plazo:
                      </label>
                      <span style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        color: '#1468B1',
                        background: 'linear-gradient(135deg, #1468B1 0%, #12274B 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {term} meses
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      step="1"
                      value={term}
                      onChange={(e) => setTerm(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        height: '12px',
                        borderRadius: '6px',
                        background: 'linear-gradient(to right, #1468B1, #D0EDFC)',
                        outline: 'none',
                        marginBottom: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <div className="d-flex justify-content-between" style={{ fontSize: '14px', color: '#000000', fontWeight: '500' }}>
                      <span>2 meses</span>
                      <span>12 meses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultados mejorados */}
              <div 
                className="results-box text-center p-4 mt-4"
                style={{
                  background: 'linear-gradient(135deg, #1468B1 0%, rgba(20, 104, 177, 0.8) 100%)',
                  borderRadius: '20px',
                  color: 'white',
                  padding: '32px',
                  boxShadow: '0 10px 30px rgba(20, 104, 177, 0.3)'
                }}
              >
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="white" strokeWidth="2" fill="none"/>
                      </svg>
                      <h5 style={{ fontSize: '16px', fontWeight: '500', margin: 0, opacity: '0.9', color: '#ffffff' }}>
                        Cuota mensual
                      </h5>
                    </div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#ffffff' }}>
                      {formatCurrency(monthlyPayment)}
                    </h3>
                  </div>
                  <div className="col-md-6">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h5 style={{ fontSize: '16px', fontWeight: '500', margin: 0, opacity: '0.9', color: '#ffffff' }}>
                        Total a pagar
                      </h5>
                    </div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#ffffff' }}>
                      {formatCurrency(totalPayment)}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Botón centralizado con tracking */}
              <div className="text-center" style={{ paddingTop: '32px' }}>
                <FinovaButton 
                  variant="primary"
                  location="calculadora"
                  customText="Solicitar Crédito"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #1468B1;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(20, 104, 177, 0.3);
          transition: all 0.3s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(20, 104, 177, 0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #1468B1;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(20, 104, 177, 0.3);
        }
      `}</style>
    </section>
  );
};

export default CreditCalculator;