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

  // Estilos base para las cards
  const getCardStyle = (cardId, position) => {
    const baseStyle = {
      background: hoveredCard === cardId ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: hoveredCard === cardId ? '0 12px 40px rgba(0, 0, 0, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      width: '280px',
      minHeight: '160px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      transform: hoveredCard === cardId ? 'translateY(-10px)' : 'translateY(0)'
    };

    // Posicionamiento para desktop
    const desktopPositions = {
      top: { 
        position: 'absolute', 
        top: '0', 
        left: '50%', 
        transform: hoveredCard === cardId ? 'translateX(-50%) translateY(-10px)' : 'translateX(-50%)', 
        zIndex: 3 
      },
      left: { 
        position: 'absolute', 
        top: '140px', 
        left: '15%', 
        zIndex: 2 
      },
      right: { 
        position: 'absolute', 
        top: '140px', 
        right: '15%', 
        zIndex: 2 
      }
    };

    return { ...baseStyle, ...desktopPositions[position] };
  };

  return (
    <section id="beneficios" style={{
      backgroundColor: '#f8f9fa',
      padding: '80px 20px 150px 20px',
      textAlign: 'center',
      position: 'relative',
      backgroundImage: 'url(/assets/images/shape/workProcessShape1_1.webp)',
      backgroundPosition: 'bottom center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '80% auto',
      minHeight: '600px'
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
          marginBottom: '50px'
        }}>
          +5000 personas nos eligieron
        </p>

        {/* Contenedor responsivo */}
        <div className="benefits-pyramid-wrapper">
          {/* Desktop: Pirámide */}
          <div className="pyramid-desktop" style={{
            position: 'relative',
            height: '400px',
            marginTop: '60px',
            display: 'block'
          }}>
            {/* Card superior */}
            <div
              style={getCardStyle(1, 'top')}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1468B1',
                marginBottom: '15px'
              }}>
                {benefits[0].title}
              </h3>
              <p style={{ color: '#555', lineHeight: '1.6', margin: 0 }}>
                {benefits[0].description}
              </p>
            </div>

            {/* Card inferior izquierda */}
            <div
              style={getCardStyle(2, 'left')}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1468B1',
                marginBottom: '15px'
              }}>
                {benefits[1].title}
              </h3>
              <p style={{ color: '#555', lineHeight: '1.6', margin: 0 }}>
                {benefits[1].description}
              </p>
            </div>

            {/* Card inferior derecha */}
            <div
              style={getCardStyle(3, 'right')}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1468B1',
                marginBottom: '15px'
              }}>
                {benefits[2].title}
              </h3>
              <p style={{ color: '#555', lineHeight: '1.6', margin: 0 }}>
                {benefits[2].description}
              </p>
            </div>
          </div>

          {/* Mobile: Grid vertical */}
          <div className="pyramid-mobile" style={{
            display: 'none',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '40px',
            paddingBottom: '60px'
          }}>
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '30px',
                  borderRadius: '15px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  width: '100%',
                  transition: 'all 0.3s ease'
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
                <p style={{ color: '#555', lineHeight: '1.6', margin: 0 }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS inline para responsive - método más seguro */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .pyramid-desktop { display: none !important; }
            .pyramid-mobile { display: flex !important; }
            #beneficios { 
              min-height: auto !important; 
              padding-bottom: 80px !important; 
            }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .pyramid-desktop div[style*="left: 15%"] { left: 5% !important; }
            .pyramid-desktop div[style*="right: 15%"] { right: 5% !important; }
          }
        `
      }} />
    </section>
  );
}