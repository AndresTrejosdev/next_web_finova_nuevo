"use client"
import React from 'react';

const FinovaButton = ({ 
  variant = 'primary', 
  location = 'unknown',
  customText = null,
  className = 'theme-btn'
}) => {
  
  const buttonConfigs = {
    primary: {
      text: 'Solicitar Crédito',
      href: 'https://app.finova.com.co/auth/register',
      style: {
        display: 'inline-block',
        padding: '15px 40px',
        fontSize: '1.1rem',
        fontWeight: '600',
        borderRadius: '8px',
        backgroundColor: 'white',
        color: '#1468B1',
        border: '2px solid white',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        textAlign: 'center'
      }
    },
    secondary: {
      text: 'Solicita tu crédito ahora',
      href: 'https://app.finova.com.co/auth/register',
      style: {
        display: 'inline-block',
        padding: '12px 30px',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: '6px',
        backgroundColor: '#1468B1',
        color: 'white',
        border: '2px solid #1468B1',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        textAlign: 'center'
      }
    }
  };

  const config = buttonConfigs[variant] || buttonConfigs.primary;
  const buttonText = customText || config.text;

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'solicitar_credito_click',
        button_location: location,
        button_text: buttonText,
        button_variant: variant,
        destination_url: config.href
      });
    }
  };

  const handleMouseEnter = (e) => {
    if (variant === 'primary') {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = 'white';
    } else if (variant === 'secondary') {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = '#1468B1';
    }
  };

  const handleMouseLeave = (e) => {
    if (variant === 'primary') {
      e.target.style.backgroundColor = 'white';
      e.target.style.color = '#1468B1';
    } else if (variant === 'secondary') {
      e.target.style.backgroundColor = '#1468B1';
      e.target.style.color = 'white';
    }
  };

  return (
    
      href={config.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={config.style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {buttonText} <i className="bi bi-arrow-right"></i>
    </a>
  );
};

export default FinovaButton;
