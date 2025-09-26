"use client"
import React, { useState } from 'react';

export default function BenefitsSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

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
    <section id="beneficios" style={{
      backgroundColor: '#f8f9fa',
      padding: '80px 20px 200px 20px', // Más espacio para la pirámide
      textAlign: 'center',
      position: 'relative',
      backgroundImage: 'url(/assets/images/shape/workProcessShape1_1.webp)',
      backgroundPosition: 'bottom center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% auto'
    }}>
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
          marginBottom: '10px'
        }}>
          Somos tu aliado financiero
        </h2>

        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '80px'
        }}>
          +5000 personas nos eligieron
        </p>

        {/* Contenedor de pirámide solo para desktop */}
        <div style={{
          position: 'relative',
          height: '450px',
          width: '100%'
        }}>
          
          {/* Card superior centrada */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: hoveredCard === 1 ? 'translateX(-50%) translateY(-10px)' : 'translateX(-50%)',
              width: '300px',
              background: hoveredCard === 1 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: hoveredCard === 1 ? '0 12px 40px rgba(0, 0, 0, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              zIndex: 3
            }}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#1468B1',
              marginBottom: '15px'
            }}>
              {benefits[0].title}
            </h3>
            <p style={{ color: '#555', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
              {benefits[0].description}
            </p>
          </div>

          {/* Card inferior izquierda */}
          <div
            style={{
              position: 'absolute',
              top: '200px',
              left: '10%',
              width: '300px',
              transform: hoveredCard === 2 ? 'translateY(-10px)' : 'translateY(0)',
              background: hoveredCard === 2 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: hoveredCard === 2 ? '0 12px 40px rgba(0, 0, 0, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              zIndex: 2
            }}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#1468B1',
              marginBottom: '15px'
            }}>
              {benefits[1].title}
            </h3>
            <p style={{ color: '#555', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
              {benefits[1].description}
            </p>
          </div>

          {/* Card inferior derecha */}
          <div
            style={{
              position: 'absolute',
              top: '200px',
              right: '10%',
              width: '300px',
              transform: hoveredCard === 3 ? 'translateY(-10px)' : 'translateY(0)',
              background: hoveredCard === 3 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: hoveredCard === 3 ? '0 12px 40px rgba(0, 0, 0, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              zIndex: 2
            }}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#1468B1',
              marginBottom: '15px'
            }}>
              {benefits[2].title}
            </h3>
            <p style={{ color: '#555', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
              {benefits[2].description}
            </p>
          </div>
        </div>
      </div>

      {/* CSS responsive */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            #beneficios {
              padding-bottom: 80px !important;
            }
            
            #beneficios > div > div:last-child {
              position: static !important;
              height: auto !important;
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            
            #beneficios > div > div:last-child > div {
              position: static !important;
              transform: none !important;
              width: 100% !important;
              left: auto !important;
              right: auto !important;
              top: auto !important;
              max-width: 350px;
              margin: 0 auto;
            }
          }
        `
      }} />
    </section>
  );
}