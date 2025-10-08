"use client";

const WhatsAppButton = () => {
  const phoneNumber = "573226962139";
  const message = encodeURIComponent("Hola, estoy interesado en solicitar un crédito de libre inversión");
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat con nosotros en WhatsApp"
    >
      {/* Icono de WhatsApp optimizado */}
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="whatsapp-icon"
      >
        <circle cx="30" cy="30" r="30" fill="#25D366" />
        <path
          d="M45.1 14.9C42.2 12 38.3 10.4 34.1 10.4C25.4 10.4 18.3 17.5 18.3 26.2C18.3 29.1 19.1 31.9 20.5 34.3L18.1 41.9L26 39.6C28.3 40.8 30.9 41.5 33.5 41.5H34.1C42.8 41.5 49.9 34.4 49.9 25.7C49.9 21.5 48.3 17.8 45.1 14.9ZM34.1 38.7C31.8 38.7 29.6 38.1 27.7 36.9L27.2 36.6L22.9 37.8L24.1 33.6L23.8 33.1C22.5 31.1 21.8 28.7 21.8 26.2C21.8 19.4 27.3 13.9 34.1 13.9C37.4 13.9 40.5 15.2 42.8 17.5C45.1 19.8 46.4 22.9 46.4 26.2C46.4 33 40.9 38.7 34.1 38.7ZM40.6 29.2C40.2 29 38.2 28 37.9 27.9C37.6 27.8 37.4 27.7 37.2 28.1C37 28.5 36.2 29.4 36 29.6C35.8 29.8 35.6 29.8 35.2 29.6C34.8 29.4 33.5 29 32 27.6C30.9 26.5 30.2 25.2 30 24.8C29.8 24.4 30 24.2 30.2 24C30.4 23.8 30.6 23.5 30.8 23.3C31 23.1 31.1 22.9 31.2 22.7C31.3 22.5 31.2 22.3 31.1 22.1C31 21.9 30.3 19.9 30 19.1C29.7 18.3 29.4 18.4 29.2 18.4C29 18.4 28.8 18.4 28.6 18.4C28.4 18.4 28.1 18.5 27.8 18.9C27.5 19.3 26.7 20.3 26.7 22.3C26.7 24.3 28.1 26.2 28.3 26.4C28.5 26.6 30.3 29.5 33.1 30.5C35.9 31.5 35.9 31.2 36.4 31.1C36.9 31 38.5 30.1 38.8 29.1C39.1 28.1 39.1 27.3 39 27.1C38.9 26.9 38.7 26.8 38.3 26.6L40.6 29.2Z"
          fill="white"
        />
      </svg>
    </a>
  );
};

export default WhatsAppButton;