// Components/Team/TeamSection.jsx
import React from 'react';

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Viviana",
      role: "Analista de crédito.", // Reemplazar con el cargo real
      image: "/assets/images/team/viviana.jpg" // Descargar del Google Drive
    },
    {
      name: "Melissa",
      role: "Auxiliar administrativo.",
      image: "/assets/images/team/melissa.jpg"
    },
    {
      name: "Sara",
      role: "Auxiliar de cartera.",
      image: "/assets/images/team/sara.jpg"
    },
    {
      name: "Daniela",
      role: "Auxiliar jurídico.",
      image: "/assets/images/team/daniela.jpg"
    }
  ];

  return (
    <section id="nosotros" style={{
      backgroundColor: '#f8f9fa',
      padding: '80px 20px',
      textAlign: 'center'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#12274B',
          marginBottom: '20px'
        }}>
          Somos Finova
        </h2>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '15px',
          lineHeight: '1.6'
        }}>
          Una entidad registrada y legalmente vigilada ante la rues y la cámara de comercio de pereira.
        </p>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '50px'
        }}>
          Nuestro equipo de trabajo está listo para escucharte, orientarte y acompañarte en cada paso.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginTop: '40px'
        }}>
          {teamMembers.map((member, index) => (
            <div key={index} style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <img 
                src={member.image} 
                alt={member.name}
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '15px'
                }}
              />
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#12274B',
                marginBottom: '5px'
              }}>
                {member.name}
              </h3>
              <p style={{ color: '#1468B1', fontSize: '0.95rem' }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}