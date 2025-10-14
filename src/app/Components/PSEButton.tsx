"use client";

import React from 'react';

const PSEButton = () => {
  return (
    <a
      href="https://app.finova.com.co/apps/pay"
      target="_self"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        backgroundColor: '#0033A0',
        color: 'white',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        boxShadow: '0 4px 12px rgba(0,51,160,0.4)',
        zIndex: 10000002,
        textDecoration: 'none',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,51,160,0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,51,160,0.4)';
      }}
    >
      PSE
    </a>
  );
};

export default PSEButton;

