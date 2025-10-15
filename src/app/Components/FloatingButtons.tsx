"use client";

import React from 'react';

const FloatingButtons: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-center gap-3">
      {/* Botón PSE */}
      <a
        href="https://app.finova.com.co/apps/pay"
        target="_self"
        rel="noopener noreferrer"
        aria-label="Pagar con PSE"
        title="Pagar con PSE"
        className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 no-underline"
        style={{ backgroundColor: '#0033A0' }}
      >
        PSE
      </a>

      {/* Botón WhatsApp */}
      <a
        href="https://wa.me/573006009480"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
        className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 no-underline"
        style={{ backgroundColor: '#25D366' }}
      >
        <i className="bi bi-whatsapp text-2xl"></i>
      </a>



      {/* Botón Back to Top */}
      <a
        href="#"
        aria-label="Volver arriba"
        title="Volver arriba"
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 no-underline"
        style={{ backgroundColor: '#1468B1' }}
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
      >
        <i className="bi bi-arrow-up-short text-3xl"></i>
      </a>
    </div>
  );
};

export default FloatingButtons;