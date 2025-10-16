"use client";

import React from 'react';
import Link from 'next/link';

const FloatingButtons: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        zIndex: 10000003,
        alignItems: 'flex-end',
      }}
    >
      {/* Botón PSE */}
      <Link
        href="/consulta-deuda"
        aria-label="Pagar con PSE"
        title="Pagar con PSE"
        style={{
          backgroundColor: '#0033A0',
          color: 'white',
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 4px 12px rgba(0,51,160,0.5)',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,51,160,0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,51,160,0.5)';
        }}
      >
        PSE
      </Link>

      {/* Botón WhatsApp */}
      <a
        href="https://wa.me/573006009480"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="Contactar por WhatsApp"
        style={{
          backgroundColor: '#25D366',
          color: 'white',
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37,211,102,0.5)',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,211,102,0.5)';
        }}
      >
        <i className="bi bi-whatsapp" style={{ fontSize: '32px' }}></i>
      </a>

      {/* Botón Back to Top */}
      <a
        href="#"
        aria-label="Volver arriba"
        title="Volver arriba"
        style={{
          backgroundColor: '#1468B1',
          color: 'white',
          width: '55px',
          height: '55px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(20,104,177,0.5)',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(20,104,177,0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,104,177,0.5)';
        }}
      >
        <i className="bi bi-arrow-up-short" style={{ fontSize: '28px' }}></i>
      </a>
    </div>
  );
};

export default FloatingButtons;
