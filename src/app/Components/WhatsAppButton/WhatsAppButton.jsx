"use client";

const WhatsAppButton = () => {
  const phoneNumber = "573226962139";
  const message = encodeURIComponent("Hola, estoy interesado en solicitar un crédito de libre inversión");
  
  const buttonStyle = {
    position: 'fixed',
    width: '70px',
    height: '70px',
    bottom: '10px',
    right: '90px',
    backgroundColor: '#25d366',
    color: 'white',
    borderRadius: '50%',
    fontSize: '32px',
    zIndex: 1000,
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    animation: 'pulse 2s infinite',
    textDecoration: 'none'
  };

  return (
    <>
      {/* Agregar los keyframes CSS */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
      
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
        title="Chatea con nosotros por WhatsApp"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1ebe5d';
          e.currentTarget.style.transform = 'scale(1.15)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#25d366';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
        }}
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
};

export default WhatsAppButton;