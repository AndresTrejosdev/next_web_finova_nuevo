"use client"
import React from 'react';

const FinovaButton = ({ 
  variant = 'primary', 
  location = 'unknown',
  customText = null,
  customStyle = {},
  className = 'theme-btn'
}) => {
  
  // Configuraciones predefinidas para diferentes variantes
  const buttonConfigs = {
    primary: {
      text: 'Solicitar Crédito',
      href: 'https://app.finova.com.co/auth/register',
      style: {
        display: 'inline-block',
        padding: '15px 40px !important',
        fontSize: '1.1rem !important',
        fontWeight: '600 !important',
        borderRadius: '8px !important',
        backgroundColor: 'white !important',
        color: '#1468B1 !important',
        border: '2px solid white !important',
        transition: 'all 0.3s ease !important',
        cursor: 'pointer !important',
        textDecoration: 'none !important',
        textAlign: 'center'
      }
    },
    secondary: {
      text: 'Solicita tu crédito ahora',
      href: 'https://app.finova.com.co/auth/register',
      style: {
        display: 'inline-block',
        padding: '12px 30px !important',
        fontSize: '1rem !important',
        fontWeight: '600 !important',
        borderRadius: '6px !important',
        backgroundColor: '#1468B1 !important',
        color: 'white !important',
        border: '2px solid #1468B1 !important',
        transition: 'all 0.3s ease !important',
        cursor: 'pointer !important',
        textDecoration: 'none !important',
        textAlign: 'center'
      }
    },
    navbar: {
      text: 'Registrarse',
      href: 'https://app.finova.com.co/auth/register',
      style: {
        display: 'inline-block',
        padding: '8px 20px !important',
        fontSize: '0.9rem !important',
        fontWeight: '500 !important',
        borderRadius: '4px !important',
        backgroundColor: '#1468B1 !important',
        color: 'white !important',
        border: '1px solid #1468B1 !important',
        transition: 'all 0.3s ease !important',
        cursor: 'pointer !important',
        textDecoration: 'none !important',
        textAlign: 'center'
      }
    }
  };

  const config = buttonConfigs[variant] || buttonConfigs.primary;
  const buttonText = customText || config.text;

  // Función para tracking de Google Analytics y Tag Manager
  const handleClick = () => {
    // Google Analytics 4 Event
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'click_solicitar_credito', {
        event_category: 'CTA_Button',
        event_label: location,
        button_text: buttonText,
        button_location: location,
        destination_url: config.href
      });
    }

    // Google Tag Manager DataLayer Push
    if (typeof window !== 'undefined' && typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'solicitar_credito_click',
        button_location: location,
        button_text: buttonText,
        button_variant: variant,
        destination_url: config.href,
        event_category: 'CTA_Button',
        event_action: 'click',
        event_label: location
      });
    }

    // Console log para debugging (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.log('FinovaButton clicked:', {
        location,
        variant,
        text: buttonText,
        url: config.href
      });
    }
  };

  const handleMouseEnter = (e) => {
    if (variant === 'primary') {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = 'white';
    } else if (variant === 'secondary' || variant === 'navbar') {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = '#1468B1';
      e.target.style.borderColor = '#1468B1';
    }
  };

  const handleMouseLeave = (e) => {
    if (variant === 'primary') {
      e.target.style.backgroundColor = 'white';
      e.target.style.color = '#1468B1';
    } else if (variant === 'secondary' || variant === 'navbar') {
      e.target.style.backgroundColor = '#1468B1';
      e.target.style.color = 'white';
      e.target.style.borderColor = '#1468B1';
    }
  };

  return (
    <a
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