"use client"
import React from 'react';

export default function BenefitsSection() {
  const benefits = [
    {
      id: 1,
      title: "Desembolso en 24 horas",
      description: "Bancolombia, Nequi, Davivienda, Daviplata, BBVA, AV Villas, otras."
    },
    {
      id: 2,
      title: "Créditos en línea",
      description: "Solo necesitas conexión a internet y anexar tus datos personales"
    },
    {
      id: 3,
      title: "Apoyo personalizado",
      description: "Atención de asesores certificados, sin bots, solo atención humana."
    }
  ];

  return (
    <section id="beneficios">
      <div className="container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#12274B',
          marginBottom: '10px',
          textAlign: 'center' 
        }}>
          Somos tu aliado financiero
        </h2>

        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '50px',
          textAlign: 'center' 
        }}>
          +5000 personas nos eligieron
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '40px',
          paddingBottom: '100px'
        }}>
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              style={{
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                textAlign: 'center',
                position: 'relative',
                zIndex: 3
              }}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1468B1',
                marginBottom: '15px'
              }}>
                {benefit.title}
              </h3>
              <p style={{ color: '#555', lineHeight: '1.6' }}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}