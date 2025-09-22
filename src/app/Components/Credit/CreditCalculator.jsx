"use client"
import { useState } from 'react';

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
    <section id="creditos" className="credit-calculator-section section-padding fix" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            {/* Amortizador con fondo blanco */}
            <div 
              className="calculator-wrapper" 
              style={{ 
                backgroundColor: 'white',
                borderRadius: '15px', 
                padding: '40px',
                boxShadow: '0 4px 20px rgba(18, 39, 75, 0.1)',
                border: '1px solid #e0e0e0'
              }}
            >
              {/* Título del amortizador */}
              <div className="text-center mb-4">
                <h3 style={{ color: '#12274B', fontWeight: '600', fontSize: '1.8rem', marginBottom: '30px' }}>
                  Calcula tu crédito
                </h3>
              </div>

              <div className="row">
                {/* Monto del crédito */}
                <div className="col-lg-6 mb-4">
                  <div className="calculator-input">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label style={{ fontSize: '16px', fontWeight: '600', color: '#12274B' }}>
                        Monto del crédito:
                      </label>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#1468B1' }}>
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
                        height: '8px',
                        borderRadius: '5px',
                        background: 'linear-gradient(to right, #1468B1, #D0EDFC)',
                        outline: 'none',
                        marginBottom: '15px'
                      }}
                    />
                    <div className="d-flex justify-content-between" style={{ fontSize: '12px', color: '#666' }}>
                      <span>$180,000</span>
                      <span>$2,000,000</span>
                    </div>
                  </div>
                </div>

                {/* Plazo */}
                <div className="col-lg-6 mb-4">
                  <div className="calculator-input">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label style={{ fontSize: '16px', fontWeight: '600', color: '#12274B' }}>
                        Plazo:
                      </label>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#1468B1' }}>
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
                        height: '8px',
                        borderRadius: '5px',
                        background: 'linear-gradient(to right, #1468B1, #D0EDFC)',
                        outline: 'none',
                        marginBottom: '15px'
                      }}
                    />
                    <div className="d-flex justify-content-between" style={{ fontSize: '12px', color: '#666' }}>
                      <span>2 meses</span>
                      <span>12 meses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cuadro azul - Solo cuota mensual y total a pagar */}
              <div 
                className="results-box text-center p-4 mt-4"
                style={{
                  backgroundColor: '#1468B1',
                  borderRadius: '15px',
                  color: 'white'
                }}
              >
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h5 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '10px', opacity: '0.9' }}>
                      Cuota mensual
                    </h5>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                      {formatCurrency(monthlyPayment)}
                    </h3>
                  </div>
                  <div className="col-md-6">
                    <h5 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '10px', opacity: '0.9' }}>
                      Total a pagar
                    </h5>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                      {formatCurrency(totalPayment)}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditCalculator;